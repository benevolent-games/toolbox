
import {pub} from "@benev/slate"
import {id_counter} from "../tools/id_counter.js"

export namespace Ecs4 {
	export type Id = number
	export type Schema = Record<string, any>
	export type AsSchema<Sc extends Schema> = Sc
	export type Select<Sc extends Schema, K extends keyof Sc> = {[P in K]: Sc[P]}
	export type Entry<State> = [Id, State]

	export class Entities<Sc extends Schema> {
		#id = id_counter()
		#map = new Map<Id, Partial<Sc>>()

		onCreated = pub<[Id, Partial<Sc>]>()
		onUpdated = pub<[Id, Partial<Sc>]>()
		onDeleted = pub<Id>()

		get<K extends keyof Sc>(id: Id) {
			const state = this.#map.get(id)

			if (!state)
				throw new Error(`entity not found by id "${id}"`)

			return state as Select<Sc, K>
		}

		has(id: Id) {
			return this.#map.has(id)
		}

		create(state: Partial<Sc>) {
			const id = this.#id()
			this.#map.set(id, state)
			this.onCreated.publish([id, state as any])
			return id
		}

		update(id: Id, state: Partial<Sc>) {
			this.#map.set(id, state)
			this.onUpdated.publish([id, state as any])
			return state
		}

		delete(id: Id) {
			this.#map.delete(id)
			this.onDeleted.publish(id)
		}

		*all() {
			yield* this.#map.entries()
		}
	}

	export class Query<Sc extends Schema, K extends keyof Sc> {
		#map = new Map<Id, Partial<Sc>>()
		#array: Entry<Partial<Sc>>[] = []

		onMatch = pub<Entry<Partial<Sc>>>()
		onUnmatch = pub<Id>()

		constructor(public kinds: K[]) {}

		match([,state]: Entry<Partial<Sc>>) {
			const skinds = Object.keys(state) as (keyof any)[]
			for (const kind of this.kinds)
				if (!skinds.includes(kind))
					return false
			return true
		}

		get matches() {
			return this.#array
		}

		has(id: Id) {
			return this.#map.has(id)
		}

		add(entry: Entry<Partial<Sc>>) {
			const [id, state] = entry
			this.#map.set(id, state)
			this.#array = [...this.#map]
			this.onMatch.publish(entry)
		}

		remove(id: Id) {
			this.#map.delete(id)
			this.#array = [...this.#map]
			this.onUnmatch.publish(id)
		}
	}

	export function synchronize_queries_with_entities<Sc extends Schema>(
			entities: Entities<Sc>,
			queries: Query<Sc, keyof Sc>[],
		) {

		// initially add matching entities to queries
		for (const entry of entities.all()) {
			for (const query of queries)
				if (query.match(entry))
					query.add(entry)
		}

		for (const query of queries) {

			// add new entities to matching queries
			entities.onCreated(entry => {
				if (query.match(entry))
					query.add(entry)
			})

			// when an entity updates, check if it needs to be added or removed
			entities.onUpdated(entry => {
				const [id] = entry
				const matches = query.match(entry)
				const hasChanged = matches !== query.has(id)
				if (hasChanged) {
					if (matches)
						query.add(entry)
					else
						query.remove(id)
				}
			})

			// remove entities that have been deleted
			entities.onDeleted(id => query.remove(id))
		}
	}

	export class Executor<Base, Tick, Sc extends Schema> {
		constructor(
				public entities: Entities<Sc>,
				public queries: Query<Sc, keyof Sc>[],
			) {
		}

		execute(tick: Tick) {}
	}

	export class System<Base, Tick, Sc extends Schema> {
		units: Unit<Base, Tick, Sc>[]

		constructor(
				public name: string,
				resolver: () => Unit<Base, Tick, Sc>[],
			) {
			this.units = resolver()
		}
	}

	export type BehaviorFn<Base, Tick, Sc extends Schema> = (
		(base: Base) => (tick: Tick) => void
	)

	export type ProcessorFn<Base, Tick, Sc extends Schema, K extends keyof Sc> = (
		(base: Base) => (tick: Tick) => (state: Select<Sc, K>, id: Id) => void
	)

	export class Behavior<Base, Tick, Sc extends Schema, K extends keyof Sc> {
		constructor(
			public name: string,
			public query: Query<Sc, K>,
			public fn: BehaviorFn<Base, Tick, Sc>,
		) {}
	}

	export type Unit<Base, Tick, Sc extends Schema> = (
		System<Base, Tick, Sc> | Behavior<Base, Tick, Sc, keyof Sc>
	)

	export type Life<Tick, Sc extends Schema, K extends keyof Sc> = {
		tick: (tick: Tick, state: Select<Sc, K>) => void
		end: () => void
	}

	export type LifeFn<Base, Tick, Sc extends Schema, K extends keyof Sc> = (
		(base: Base) => (init: Select<Sc, K>, id: Id) => Life<Tick, Sc, K>
	)

	export class Hub<Base, Tick, Sc extends Schema> {
		constructor(public entities: Entities<Sc>) {}

		system = (name: string, resolver: () => Unit<Base, Tick, Sc>[]) => (
			new System<Base, Tick, Sc>(name, resolver)
		)

		behavior = (name: string) => ({
			query: <K extends keyof Sc>(...kinds: K[]) => ({

				processor: (fn: ProcessorFn<Base, Tick, Sc, K>) => {
					const query = new Query<Sc, K>(kinds)
					const behaviorFn: BehaviorFn<Base, Tick, Sc> = base => {
						const fn2 = fn(base)
						return tick => {
							const fn3 = fn2(tick)
							for (const [id, state] of query.matches)
								fn3(state as Select<Sc, K>, id)
						}
					}
					return new Behavior(name, query, behaviorFn)
				},

				lifecycle: (fn: LifeFn<Base, Tick, Sc, K>) => {
					const query = new Query<Sc, K>(kinds)
					const behaviorFn: BehaviorFn<Base, Tick, Sc> = base => {
						const fn2 = fn(base)
						const map = new Map<Id, Life<Tick, Sc, K>>()
						query.onMatch(([id, state]) => {
							const life = fn2(state as Select<Sc, K>, id)
							map.set(id, life)
						})
						query.onUnmatch(id => {
							const life = map.get(id)
							if (life) {
								life.end()
								map.delete(id)
							}
						})
						return tick => {
							for (const [id, state] of query.matches) {
								const life = map.get(id)!
								life.tick(tick, state as Select<Sc, K>)
							}
						}
					}
					return new Behavior(name, query, behaviorFn)
				},
			}),
		})
	}
}

/////////////////////////////

// type Base = {}
// type Tick = {}
// type MySchema = {
// 	alpha: number
// 	bravo: string
// }

// const hub = new Ecs4.Hub<Base, Tick, MySchema>()

// const entities = hub.entities()
// const query = entities.query("alpha")

// const {system, behavior} = hub

/*

const hub = new Ecs4.Hub<Base, Tick, MySchema>()

const systems = hub.prep(({system, behavior}) => [

])

const systems = system("humanoid", () => [

	behavior("create dynamics")
		.query("alpha")
		.lifecycle(() => {
			return {
				tick() {},
				end() {},
			}
		}),

	system("cool subsystems", () => {
		const map = new Map()
		return [
			behavior("something incredible")
				.query("alpha")
				.lifecycle(realm => init => {
					return {
						tick() {},
						end() {},
					}
				})m
		]
	})
])

const systems = hub.systems(
	system("physics").behaviors(

		behavior("cool process")
			.query("alpha")
			.processor(base => tick => state => {
				state.alpha
				state.bravo
			}),

		behavior("create dynamics")
			.query("alpha")
			.lifecycle(() => {
				return {
					tick() {},
					end() {},
				}
			}),

		...(() => {
			const map = new Map()
			return system("complex interlaced subbehaviors").behaviors(

			)
		})(),

		behavior("something incredible")
			.complex(query => {
				const map = new Map()
				return []
			})

		behavior("something else")
			.queries(({query}) => ({
				a: query("alpha"),
				b: query("alpha", "bravo"),
			}))
			.lifecycles(() => {
				const map = new Map()
				return {
					a: () => {
						return {
							tick() {},
							end() {},
						}
					},
					b: () => {},
				}
			}
			}),
	)
)

*/























































































