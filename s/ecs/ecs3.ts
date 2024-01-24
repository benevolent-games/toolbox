
import {Pub, pub} from "@benev/slate"
import {measure} from "../tools/measure.js"
import {id_counter} from "../tools/id_counter.js"

export namespace Ecs3 {
	export type Id = number
	export type Schema = Record<string, any>
	export type AsSchema<Sc extends Schema> = Sc
	export type Query<Sc extends Schema> = (keyof Sc)[]
	export type Select<Sc extends Schema, Q extends Query<Sc>> = {[P in Q[number]]: Sc[P]}
	export type Entry<State> = [Id, State]

	export type Passes<Sc extends Schema> = Record<string, Pass<Sc, Query<Sc>>>
	export type Selections<Sc extends Schema, P extends Passes<Sc>> = {
		[K in keyof P]: Entry<Select<Sc, P[K]["query"]>>[]
	}
	export type Exe<Tick, Sc extends Schema, P extends Passes<Sc>> = (tick: Tick, selections: Selections<Sc, P>) => void

	export type EntityPubs<State> = {
		created: Pub<Entry<State>>
		updated: Pub<Entry<State>>
		deleted: Pub<Id>
	}

	export class Entities<Sc extends Schema> {
		#id = id_counter()
		#map = new Map<Id, Partial<Sc>>()

		events: EntityPubs<Sc> = {
			created: pub(),
			updated: pub(),
			deleted: pub(),
		}

		get<Q extends Query<Sc>>(id: Id) {
			const state = this.#map.get(id)

			if (!state)
				throw new Error(`entity not found by id "${id}"`)

			return state as Select<Sc, Q>
		}

		has(id: Id) {
			return this.#map.has(id)
		}

		create(state: Partial<Sc>) {
			const id = this.#id()
			this.#map.set(id, state)
			this.events.created.publish([id, state as any])
			return id
		}

		update(id: Id, state: Partial<Sc>) {
			this.#map.set(id, state)
			this.events.updated.publish([id, state as any])
			return state
		}

		delete(id: Id) {
			this.#map.delete(id)
			this.events.deleted.publish(id)
		}

		*all() {
			yield* this.#map.entries()
		}
	}

	export type PassEvents<State> = {
		initialize: (id: Id, state: State) => void
		dispose: (id: Id) => void
	}

	export const pass_event_noops: PassEvents<Partial<Schema>> = Object.freeze({
		initialize() {},
		dispose() {},
	})

	export class Pass<Sc extends Schema, Q extends Query<Sc>> {
		constructor(
			public query: Q,
			public events: PassEvents<Select<Sc, Q>>,
		) {}
	}

	export class Executable<Tick, Sc extends Schema, P extends Passes<Sc>> {
		constructor(
			public name: string,
			public passes: P,
			public exe: Exe<Tick, Sc, P>,
		) {}
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

	export class Index<Sc extends Schema> {
		#map = new Map<Query<Sc>, Map<Id, Partial<Sc>>>()

		constructor(queries: Query<Sc>[]) {
			for (const query of queries)
				this.#map.set(query, new Map())
		}

		has(query: Query<Sc>, id: Id) {
			const states = this.#map.get(query)!
			return states.has(id)
		}

		set(query: Query<Sc>, id: Id, state: Partial<Sc>) {
			const states = this.#map.get(query)!
			states.set(id, state)
		}

		delete(query: Query<Sc>, id: Id) {
			const states = this.#map.get(query)!
			states.delete(id)
		}

		get(query: Query<Sc>) {
			const entities = this.#map.get(query)!
			if (!entities)
				throw new Error(`failed to fetch entities for query`)
			return entities
		}
	}

	export class Executor<Tick, Sc extends Schema> {
		#index: Index<Sc>

		constructor(
				entityEvents: EntityPubs<Partial<Sc>>,
				public executables: Executable<Tick, Sc, Passes<Sc>>[],
			) {

			const passes = executables.flatMap(e => Object.values(e.passes))
			const queries = passes.map(p => p.query)

			this.#index = new Index(queries)

			for (const {query, events: passEvents} of passes) {
				entityEvents.created(payload => {
					const [id, state] = payload
					if (entity_matches_query(state, query)) {
						this.#index.set(query, id, state)
						passEvents.initialize(id, state as any)
					}
				})

				entityEvents.updated(payload => {
					const [id, state] = payload
					const matches = entity_matches_query(state, query)
					const changed = matches !== this.#index.has(query, id)

					if (changed) {
						if (matches) {
							this.#index.set(query, id, state)
							passEvents.initialize(id, state as any)
						}
						else {
							this.#index.delete(query, id)
							passEvents.dispose(id)
						}
					}
				})

				entityEvents.deleted(id => {
					this.#index.delete(query, id)
					passEvents.dispose(id)
				})
			}
		}

		#execute(tick: Tick, executable: Executable<Tick, Sc, Passes<Sc>>) {
			const selections: Selections<Sc, Passes<Sc>> = {}

			for (const [name, pass] of Object.entries(executable.passes)) {
				const entityMap = this.#index.get(pass.query)
				const entities = [...entityMap] as any
				selections[name] = entities
			}

			executable.exe(tick, selections)
		}

		execute_all(tick: Tick, diagnostics?: Map<Executable<any, any, any>, number>) {
			if (diagnostics)
				for (const executable of this.executables)
					diagnostics.set(executable, measure(() => {
						this.#execute(tick, executable)
					}))
			else
				for (const executable of this.executables)
					this.#execute(tick, executable)
		}
	}

	export type QuickPass<Sc extends Schema> = (
		<Q extends Query<Sc>>({}: {
			query: Q
			events?: PassEvents<Select<Sc, Q>>
		}) => Pass<Sc, Q>
	)

	export type Ret<Tick, Sc extends Schema> = {
		pass: QuickPass<Sc>,
		passes: <P extends Passes<Sc>>(passes: P) => {
			execute: (exe: Exe<Tick, Sc, P>) => Executable<Tick, Sc, P>
		}
	}

	export type Life<Tick, Sc extends Schema, Q extends Query<Sc>> = {
		execute: (tick: Tick, state: Select<Sc, Q>, id: Id) => void
		dispose: () => void
	}

	export const no_life = Object.freeze({
		execute() {},
		dispose() {},
	})

	export namespace Fns {
		export type Processor<Base, Tick, Sc extends Schema, Q extends Query<Sc>> = (
			(base: Base) => (tick: Tick) => (state: Select<Sc, Q>, id: Id) => void
		)

		export type Lifecycle<Base, Tick, Sc extends Schema, Q extends Query<Sc>> = (
			(base: Base) =>
				(init: Select<Sc, Q>, id: Id) =>
					Life<Tick, Sc, Q>
		)

		export type Multi<Base, Tick, Sc extends Schema, P extends Passes<Sc>, E extends Exe<Tick, Sc, P>> = (
			(base: Base) => {
				passes: P
				exe: E
			}
		)

		export type Complex<Base, Tick, Sc extends Schema> = (
			(base: Base) => (ret: Ret<Tick, Sc>) => Executable<Tick, Sc, any>
		)
	}

	export class Hub<Base, Tick, Sc extends Schema> {
		entities = () => new Entities<Sc>()

		executor = (
				base: Base,
				entities: Entities<Sc>,
				pre_executables: ((base: Base) => Executable<Tick, Sc, any>)[],
			) => new Executor<Tick, Sc>(
			entities.events,
			pre_executables.map(fn => fn(base)),
		)

		pipeline = (...pre_executables: ((base: Base) => Executable<Tick, Sc, any>)[]) => (
			pre_executables
		)

		pass: QuickPass<Sc> = (
			({query, events = pass_event_noops}) =>
				new Pass(query, events)
		)

		behavior = (name: string) => ({
			complex: (fn: Fns.Complex<Base, Tick, Sc>) => (base: Base) => fn(base)({
				pass: this.pass,
				passes: passes => ({
					execute: exe => new Executable(name, passes, exe),
				}),
			}),

			select: <Q extends Query<Sc>>(...query: Q) => ({
				processor: (fn: Fns.Processor<Base, Tick, Sc, Q>) => (base: Base) => {
					const fn2 = fn(base)

					const passes = {
						only: new Pass<Sc, Q>(query, pass_event_noops)
					} satisfies Passes<Sc>

					return new Executable<Tick, Sc, typeof passes>(
						name,
						passes,
						(tick, selections) => {
							const fn3 = fn2(tick)
							for (const [id, state] of selections.only)
								fn3(state, id)
						},
					)
				},

				lifecycle: (fn: Fns.Lifecycle<Base, Tick, Sc, Q>) => (base: Base) => {
					const fn2 = fn(base)
					const map = new Map<Id, Life<Tick, Sc, Q>>()

					const passes = {
						only: new Pass<Sc, Q>(query, {
							initialize(id, state) {
								map.set(id, fn2(state, id))
							},
							dispose(id) {
								const lifecycle = map.get(id)
								if (lifecycle) {
									lifecycle.dispose()
									map.delete(id)
								}
							},
						}),
					} as Passes<Sc>

					return new Executable<Tick, Sc, typeof passes>(
						name,
						passes,
						(tick, selections) => {
							for (const [id, state] of selections.only)
								map.get(id)!.execute(tick, state, id)
						},
					)
				},
			}),
		})
	}
}

/////////////////////////////
/////////////////////////////

// type MyBase = {}
// type MyTick = {}
// type MySchema = Ecs3.AsSchema<{
// 	alpha: number
// 	bravo: boolean
// 	charlie: string
// }>

// const hub = new Ecs3.Hub<MyBase, MyTick, MySchema>()

// const lol = (hub
// 	.behavior("lol")
// 	.select("alpha", "bravo")
// 	.processor(base => tick => state => {
// 		state.alpha
// 		state.bravo
// 	})
// )

// const lolx = (hub
// 	.behavior("lolx")
// 	.select("alpha", "bravo")
// 	.lifecycle(base => (init, id) => {
// 		return {
// 			execute(tick, state) {},
// 			dispose() {},
// 		}
// 	})
// )

// const lol2 = (hub
// 	.behavior("rofl")
// 	.complex(base => ({passes, pass}) => {
// 		let map = new Map()
// 		return passes({
// 			alphas: pass({
// 				query: ["alpha"],
// 			}),
// 			others: pass({
// 				query: ["bravo", "charlie"],
// 				events: {
// 					initialize(id, state) {
// 						state.bravo
// 					},
// 					dispose() {},
// 				},
// 			}),
// 		}).execute((_tick, selections) => {
// 			selections.alphas
// 			// selections.thisShouldFail
// 		})
// 	})
// )

