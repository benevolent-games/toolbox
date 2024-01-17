
import {Pub, pub} from "@benev/slate"
import {measure} from "../tools/measure.js"
import {id_counter} from "../tools/id_counter.js"

export namespace Ecs {
	export type Id = number
	export type Schema = {[kind: string]: any}
	export type AsSchema<Sc extends Schema> = Sc
	export type Select<Sc extends Schema, K extends keyof Sc> = {[P in K]: Sc[P]}
	export type AnyEntity = [Id, Schema]
	export type Entity<Sc extends Schema, K extends keyof Sc = keyof Sc> = (
		[Id, Select<Sc, K>]
	)

	export type EntityEventPayloads<Sc extends Schema> = {
		onEntityCreated: [Id, Partial<Sc>]
		onEntityUpdated: [Id, Partial<Sc>]
		onEntityDeleted: Id
	}

	export type EntityEventPubs<Sc extends Schema> = {
		[P in keyof EntityEventPayloads<Sc>]: Pub<EntityEventPayloads<Sc>[P]>
	}

	export type EntityEventFns<Sc extends Schema> = {
		[P in keyof EntityEventPayloads<Sc>]: (p: EntityEventPayloads<Sc>[P]) => void
	}

	export type ExecuteFn<Tick, Sc extends Schema, K extends keyof Sc = keyof Sc> = (
		(tick: Tick, entities: Entity<Sc, K>[]) => void
	)

	export class System<Tick, Sc extends Schema, K extends keyof Sc = keyof Sc> {
		name: string
		kinds: K[]
		execute: ExecuteFn<Tick, Sc, K>
		events: EntityEventFns<Sc>

		constructor(params: {
				name: string
				kinds: K[]
				execute: ExecuteFn<Tick, Sc, K>
				events?: EntityEventFns<Sc>
			}) {
			this.name = params.name
			this.kinds = params.kinds
			this.execute = params.execute
			this.events = params.events ?? {
				onEntityCreated: () => {},
				onEntityUpdated: () => {},
				onEntityDeleted: () => {},
			}
		}

		match(kinds: (keyof Sc)[]) {
			for (const systemKind of this.kinds)
				if (!kinds.includes(systemKind))
					return false
			return true
		}
	}

	export class Entities<Sc extends Schema> {
		#id = id_counter()
		#map = new Map<Id, Partial<Sc>>()

		events: EntityEventPubs<Sc> = {
			onEntityCreated: pub(),
			onEntityUpdated: pub(),
			onEntityDeleted: pub(),
		}

		get<K extends keyof Sc = keyof Sc>(id: Id) {
			return this.#map.get(id)! as Select<Sc, K>
		}

		has(id: Id) {
			return this.#map.has(id)
		}

		create<State extends Partial<Sc>>(state: State) {
			const id = this.#id()
			this.#map.set(id, state)
			this.events.onEntityCreated.publish([id, state])
			return id
		}

		delete(id: Id) {
			this.#map.delete(id)
			this.events.onEntityDeleted.publish(id)
		}

		*all() {
			yield* this.#map.entries()
		}
	}

	export class Executor<Tick, Sc extends Schema> {
		#index = new Map<System<Tick, Sc>, Map<Id, Partial<Sc>>>()
		diagnostics = new Map<System<Tick, Sc>, number>

		constructor(events: EntityEventPubs<Sc>, public systems: System<Tick, Sc>[]) {
			for (const system of systems)
				this.#index.set(system, new Map())

			events.onEntityCreated(([id, state]) => {
				for (const [system, entities] of this.#index) {
					if (system.match(Object.keys(state)))
						entities.set(id, state)
				}
				return id
			})

			events.onEntityUpdated(() => {})

			events.onEntityDeleted(id => {
				for (const [,entities] of this.#index)
					entities.delete(id)
			})
		}

		execute_all_systems(tick: Tick) {
			for (const [system, entities] of this.#index) {
				this.diagnostics.set(system, measure(() => {
					system.execute(tick, [...entities.entries()] as Entity<Sc>[])
				}))
			}
		}
	}

	export type ProcessorFn<Base, Tick, Sc extends Schema, K extends keyof Sc> = (
		(base: Base) => (tick: Tick) => (state: Select<Sc, K>, id: Id) => void
	)

	export type Life<Tick, Sc extends Schema, K extends keyof Sc> = {
		execute: (tick: Tick, state: Select<Sc, K>, id: Id) => void
		dispose: () => void
	}

	export type LifecycleFn<Base, Tick, Sc extends Schema, K extends keyof Sc> = (
		(base: Base) =>
			(init: Select<Sc, K>, id: Id) =>
				Life<Tick, Sc, K>
	)

	export class Hub<Base, Tick, Sc extends Schema> {
		entities = () => new Entities<Sc>()

		executor = (
				base: Base,
				entities: Entities<Sc>,
				presystems: ((base: Base) => System<Tick, Sc>)[],
			) => new Executor(
			entities.events,
			presystems.map(fn => fn(base)),
		)

		presystems = (...presystems: ((base: Base) => System<Tick, Sc>)[]) => (
			presystems
		)

		systematize = (...presystems: ((base: Base) => System<Tick, Sc>)[]) => (
			(base: Base) => presystems.map(fn => fn(base))
		)

		processor = (name: string) => (<K extends keyof Sc>(...kinds: K[]) =>
			(fn: ProcessorFn<Base, Tick, Sc, K>) => (base: Base) => {
				const fn2 = fn(base)
				return new System<Tick, Sc, K>({
					name,
					kinds,
					execute(tick, entities) {
						const fn3 = fn2(tick)
						for (const [id, state] of entities)
							fn3(state, id)
					},
				})
			}
		)

		lifecycle = ((name: string) => <K extends keyof Sc>(...kinds: K[]) =>
			(fn: LifecycleFn<Base, Tick, Sc, K>) => (base: Base) => {
				const fn2 = fn(base)
				const map = new Map<Id, Life<Tick, Sc, K>>()
				return new System<Tick, Sc, K>({
					name,
					kinds,
					execute(tick, entities) {
						for (const [id, state] of entities) {
							const lifecycle = map.get(id)

							// update existing entities
							if (lifecycle)
								lifecycle.execute(tick, state, id)

							// initialize entities
							else
								map.set(id, fn2(state, id))
						}
					},
					events: {
						onEntityCreated() {},
						onEntityUpdated() {},
						onEntityDeleted(id) {
							const lifecycle = map.get(id)!
							lifecycle.dispose()
							map.delete(id)
						},
					},
				})
			}
		)
	}
}

