
import {Pub, pub} from "@benev/slate"
import {measure} from "../tools/measure.js"
import {id_counter} from "../tools/id_counter.js"

export namespace Ecs2 {
	export type Id = number
	export type Schema = {[kind: string]: any}
	export type AsSchema<Sc extends Schema> = Sc

	export type AnyEntry = [Id, Schema]
	export type Entry<Sc extends Schema, K extends keyof Sc = keyof Sc> = (
		[Id, Select<Sc, K>]
	)

	export type Query<Sc extends Schema> = (keyof Sc)[]
	export type Queries<Sc extends Schema> = {[name: string]: Query<Sc>}
	export type Select<Sc extends Schema, K extends keyof Sc> = {[P in K]: Sc[P]}
	export type Selections<Sc extends Schema, Qs extends Queries<Sc>> = {
		[P in keyof Qs]: Entry<Sc, Qs[P][number]>[]
	}

	export type ExecuteFn<Tick, Sc extends Schema, Q extends Queries<Sc>> = (
		(tick: Tick, selections: Selections<Sc, Q>) => void
	)

	export namespace Events {
		export type Payloads<Sc extends Schema> = {
			onEntityCreated: [Id, Partial<Sc>]
			onEntityUpdated: [Id, Partial<Sc>]
			onEntityDeleted: Id
		}

		export type Pubs<Sc extends Schema> = {
			[P in keyof Payloads<Sc>]: Pub<Payloads<Sc>[P]>
		}

		export type Fns<Sc extends Schema> = {
			[P in keyof Payloads<Sc>]: (p: Payloads<Sc>[P]) => void
		}

		export const noops: Fns<Schema> = Object.freeze({
			onEntityCreated: () => {},
			onEntityUpdated: () => {},
			onEntityDeleted: () => {},
		})
	}

	export class System<Tick, Sc extends Schema, Qs extends Queries<Sc>> {
		name: string
		queries: Qs
		execute: ExecuteFn<Tick, Sc, Qs>
		events: Events.Fns<Sc>

		constructor(params: {
				name: string
				queries: Qs
				execute: ExecuteFn<Tick, Sc, Qs>
				events: Events.Fns<Sc>
			}) {
			this.name = params.name
			this.queries = params.queries
			this.execute = params.execute
			this.events = params.events
		}
	}

	export class Entities<Sc extends Schema> {
		#id = id_counter()
		#map = new Map<Id, Partial<Sc>>()

		events: Events.Pubs<Sc> = {
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

	export function entity_matches_query<Sc extends Schema>(
			state: Partial<Sc>,
			query: Query<Sc>,
		) {
		const skinds = Object.keys(state) as (keyof Sc)[]
		for (const qkind of query)
			if (!skinds.includes(qkind))
				return false
		return true
	}

	export class Executor<Tick, Sc extends Schema> {
		#index = new Map<System<Tick, Sc, Queries<Sc>>, Map<Query<Sc>, Map<Id, Partial<Sc>>>>()

		constructor(
				events: Events.Pubs<Sc>,
				public systems: System<Tick, Sc, Queries<Sc>>[],
			) {

			for (const system of systems) {
				const querymap = new Map< Query<Sc>, Map<Id, Partial<Sc>> >()

				for (const query of Object.values(system.queries))
					querymap.set(query, new Map())

				this.#index.set(system, querymap)
			}

			events.onEntityCreated(([id, state]) => {
				for (const querymap of this.#index.values())
					for (const [query, map] of querymap)
						if (entity_matches_query(state, query))
							map.set(id, state)
				return id
			})

			events.onEntityUpdated(() => {})

			events.onEntityDeleted(id => {
				for (const [system, querymap] of this.#index) {
					for (const map of querymap.values()) {
						system.events.onEntityDeleted(id)
						map.delete(id)
					}
				}
			})
		}

		#execute(tick: Tick, system: System<Tick, Sc, Queries<Sc>>, querymap: Map<Query<Sc>, Map<Id, Partial<Sc>>>) {
			const selections: Selections<Sc, Queries<Sc>> = {}

			for (const [name, query] of Object.entries(system.queries)) {
				const entityMap = querymap.get(query)!
				const entities = [...entityMap] as any
				selections[name] = entities
			}

			system.execute(tick, selections)
		}

		execute_all_systems(tick: Tick, diagnostics?: Map<System<Tick, Sc, Queries<Sc>>, number>) {
			if (diagnostics)
				for (const [system, querymap] of this.#index)
					diagnostics.set(system, measure(() => {
						this.#execute(tick, system, querymap)
					}))
			else
				for (const [system, querymap] of this.#index)
					this.#execute(tick, system, querymap)
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

	export type SysFn<Base, Tick, Sc extends Schema, Q extends Queries<Sc>> = (
		(base: Base) => ConstructorParameters<typeof System<Tick, Sc, Q>>[0]
	)

	// type LolSchema = {lol: number, rofl: string}
	// function qqq<Q extends {[name: string]: (keyof LolSchema)[]}>(_q: Q) {
	// 	return {} as unknown as {[P in keyof Q]: LolSchema[Q[P][number]]}
	// }
	// const lol = qqq({zzz: ["lol"]})

	export class Hub<Base, Tick, Sc extends Schema> {
		entities = () => new Entities<Sc>()

		executor = (
				base: Base,
				entities: Entities<Sc>,
				presystems: ((base: Base) => System<Tick, Sc, Queries<Sc>>)[],
			) => new Executor(
			entities.events,
			presystems.map(fn => fn(base)),
		)

		pipeline = (...presystems: ((base: Base) => System<Tick, Sc, any>)[]) => (
			presystems
		)

		system = <Qs extends Queries<Sc>>(fn: SysFn<Base, Tick, Sc, Qs>) => (
			(base: Base) => new System<Tick, Sc, Qs>(fn(base))
		)

		behavior = (name: string) => ({
			queries: <Qs extends Queries<Sc>>(queries: Qs) => ({
				system: (params: {events: Events.Fns<Sc>}) => {}
			}),

			select: <Q extends Query<Sc>>(...query: Q) => ({

				processor: (fn: ProcessorFn<Base, Tick, Sc, Q[number]>) => (base: Base) => {
					const fn2 = fn(base)
					return new System<Tick, Sc, {only: Q}>({
						name,
						queries: {only: query},
						events: Events.noops,
						execute(tick, selections) {
							const fn3 = fn2(tick)
							for (const [id, state] of selections.only)
								fn3(state, id)
						},
					})
				},

				lifecycle: (fn: LifecycleFn<Base, Tick, Sc, Q[number]>) => (base: Base) => {
					const fn2 = fn(base)
					const map = new Map<Id, Life<Tick, Sc, Q[number]>>()
					return new System<Tick, Sc, {only: Q}>({
						name,
						queries: {only: query},
						execute(tick, selections) {
							for (const [id, state] of selections.only) {
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
								const lifecycle = map.get(id)
								if (lifecycle) {
									lifecycle.dispose()
									map.delete(id)
								}
							},
						},
					})
				},
			}),
		})
	}
}

