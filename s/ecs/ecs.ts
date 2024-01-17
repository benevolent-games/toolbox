
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

	class EntityStore<Sc extends Schema> {
		#id = id_counter()
		#map = new Map<Id, Partial<Sc>>()

		get<K extends keyof Sc = keyof Sc>(id: Id) {
			return this.#map.get(id)! as Select<Sc, K>
		}

		has(id: Id) {
			return this.#map.has(id)
		}

		create<State extends Partial<Sc>>(state: State) {
			const id = this.#id()
			this.#map.set(id, state)
			return id
		}

		delete(id: Id) {
			this.#map.delete(id)
		}

		*all() {
			yield* this.#map.entries()
		}
	}

	export class System<Tick, Sc extends Schema, K extends keyof Sc = keyof Sc> {
		constructor(
			public name: string,
			public kinds: K[],
			public execute: (tick: Tick, entities: Entity<Sc, K>[]) => void
		) {}

		match(kinds: (keyof Sc)[]) {
			for (const systemKind of this.kinds)
				if (!kinds.includes(systemKind))
					return false
			return true
		}
	}

	export class Entities<Tick, Sc extends Schema> extends EntityStore<Sc> {
		#index = new Map<System<Tick, Sc>, Map<Id, Partial<Sc>>>()

		diagnostics = new Map<System<Tick, Sc>, number>

		registerSystems(systems: System<Tick, Sc>[]) {
			for (const system of systems)
				this.#index.set(system, new Map())
		}

		create<State extends Partial<Sc>>(state: State) {
			const id = super.create(state)
			for (const [system, entities] of this.#index) {
				if (system.match(Object.keys(state)))
					entities.set(id, state)
			}
			return id
		}

		delete(id: Id) {
			super.delete(id)
			for (const [,entities] of this.#index)
				entities.delete(id)
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
		update: (tick: Tick, state: Select<Sc, K>, id: Id) => void
		dispose: (tick: Tick) => void
	}

	export type LifecycleFn<Base, Tick, Sc extends Schema, K extends keyof Sc> = (
		(base: Base) =>
			(init: Select<Sc, K>, id: Id) =>
				Life<Tick, Sc, K>
	)

	export class Hub<Base, Tick, Sc extends Schema> {
		entities = () => new Entities<Tick, Sc>()

		systematize = (...presystems: ((base: Base) => System<Tick, Sc>)[]) => (
			(base: Base) => presystems.map(fn => fn(base))
		)

		processor = (name: string) => (<K extends keyof Sc>(...kinds: K[]) =>
			(fn: ProcessorFn<Base, Tick, Sc, K>) => (base: Base) => {
				const fn2 = fn(base)
				return new System<Tick, Sc, K>(name, kinds, (tick, entities) => {
					const fn3 = fn2(tick)
					for (const [id, state] of entities)
						fn3(state, id)
				})
			}
		)

		lifecycle = ((name: string) => <K extends keyof Sc>(...kinds: K[]) =>
			(fn: LifecycleFn<Base, Tick, Sc, K>) => (base: Base) => {
				const fn2 = fn(base)
				const map = new Map<Id, Life<Tick, Sc, K>>()
				return new System<Tick, Sc, K>(name, kinds, (tick, entities) => {

					// prune missing entities
					for (const id of [...map.keys()]) {
						const exists = entities.some(([eid]) => eid === id)
						if (!exists) {
							const lifecycle = map.get(id)!
							lifecycle.dispose(tick)
							map.delete(id)
						}
					}

					for (const [id, state] of entities) {

						// update existing entities
						if (map.has(id)) {
							const lifecycle = map.get(id)!
							lifecycle.update(tick, state as any, id)
						}

						// initialize entities
						else {
							const lifecycle = fn2(state as any, id)
							map.set(id, lifecycle)
						}
					}
				})
			}
		)
	}
}

