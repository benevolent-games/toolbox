
import {pub} from "@benev/slate"
import {id_counter} from "../tools/id.js"
import {RunningAverage} from "../tools/running_average.js"

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
		system: System<Base, Tick, Sc>
		diagnostics = new Map<Unit<any, any, any>, RunningAverage>()

		constructor(
				entities: Entities<Sc>,
				public base: Base,
				preSystem: PreSystem<Base, Tick, Sc>,
			) {

			const queries: Query<Sc, keyof Sc>[] = []

			// const recurse = (preSystem: PreSystem<Base, Tick, Sc>) => {
			// 	const preUnits = preSystem.resolver(base)
			// 	const units: Unit<Base, Tick, Sc>[] = []

			// 	for (const preUnit of preUnits) {
			// 		if (preUnit instanceof PreSystem) {
			// 			const unit = recurse(preUnit)
			// 			units.push(unit)
			// 		}
			// 		else if (preUnit instanceof Behavior) {
			// 			units.push(preUnit)
			// 			if (preUnit.query)
			// 				queries.push(preUnit.query)
			// 			this.diagnostics.set(preUnit, new RunningAverage())
			// 		}
			// 		else {
			// 			throw new Error(`invalid kind of unit in system "${preSystem.name}"`)
			// 		}
			// 	}

			// 	const system = new System(preSystem.name, units)
			// 	this.diagnostics.set(system, new RunningAverage())
			// 	return system
			// }

			this.system = preSystem.resolve(base)

			this.system.walk({
				unit: u => this.diagnostics.set(u, new RunningAverage()),
				behavior: b => {
					if (b.query)
						queries.push(b.query)
				},
			})

			synchronize_queries_with_entities(entities, queries)
		}

		// #recurse(tick: Tick, system: System<Base, Tick, Sc>) {
		// 	for (const unit of system.units) {
		// 		const average = this.diagnostics.get(unit)!

		// 		if (unit instanceof Behavior)
		// 			average.add(measure(() => unit.fn(tick)))

		// 		else if (unit instanceof System)
		// 			average.add(measure(() => this.#recurse(tick, unit)))

		// 		else throw new Error(`invalid kind of unit in system "${system.name}"`)
		// 	}
		// }

		execute(tick: Tick) {
			this.system.walk({
				behavior: b => b.fn(tick),
			})
		}
	}

	export type WalkFns = {
		unit?: (unit: Unit<any, any, any>) => void
		system?: (system: System<any, any, any>) => void
		behavior?: (behavior: Behavior<any, any, any>) => void
	}

	export class System<Base, Tick, Sc extends Schema> {
		constructor(
			public name: string,
			public units: Unit<Base, Tick, Sc>[],
		) {}

		walk(fns: WalkFns) {
			System.walk(this, fns)
		}

		static walk(system: System<any, any, any>, fns: WalkFns) {
			const {
				unit: fnUnit = () => {},
				system: fnSystem = () => {},
				behavior: fnBehavior = () => {},
			} = fns

			fnUnit(system)
			fnSystem(system)

			for (const unit of system.units) {
				if (unit instanceof Behavior) {
					fnUnit(unit)
					fnBehavior(unit)
				}
				else if (unit instanceof System) {
					fnUnit(unit)
					fnSystem(unit)
					this.walk(unit, fns)
				}
				else {
					throw new Error(`invalid unit in system "${system.name}"`)
				}
			}
		}
	}

	export class PreSystem<Base, Tick, Sc extends Schema> {
		constructor(
			public name: string,
			public fn: (base: Base) => PreUnit<Base, Tick, Sc>[]
		) {}

		resolve(base: Base) {
			const preUnits = this.fn(base).map(pre => pre.resolve(base)) as Unit<Base, Tick, Sc>[]
			return new System<Base, Tick, Sc>(this.name, preUnits)
		}
	}

	export type BehaviorFn<Tick> = (
		(tick: Tick) => void
	)

	export type PreBehaviorFn<Base, Tick> = (
		(base: Base) => (tick: Tick) => void
	)

	export type ProcessorFn<Base, Tick, Sc extends Schema, K extends keyof Sc> = (
		(base: Base) => (tick: Tick) => (state: Select<Sc, K>, id: Id) => void
	)

	export class PreBehavior<Base, Tick, Sc extends Schema, K extends keyof Sc> {
		constructor(
			public name: string,
			public query: Query<Sc, K> | null,
			public fn: (base: Base) => BehaviorFn<Tick>,
		) {}

		resolve(base: Base) {
			return new Behavior<Tick, Sc, K>(this.name, this.query, this.fn(base))
		}
	}

	export class Behavior<Tick, Sc extends Schema, K extends keyof Sc> {
		constructor(
			public name: string,
			public query: Query<Sc, K> | null,
			public fn: BehaviorFn<Tick>,
		) {}
	}

	export type Unit<Base, Tick, Sc extends Schema> = (
		System<Base, Tick, Sc> | Behavior<Tick, Sc, keyof Sc>
	)

	export type PreUnit<Base, Tick, Sc extends Schema> = (
		PreSystem<Base, Tick, Sc> | PreBehavior<Base, Tick, Sc, keyof Sc>
	)

	export type Life<Tick, Sc extends Schema, K extends keyof Sc> = {
		tick: (tick: Tick, state: Select<Sc, K>) => void
		end: () => void
	}

	export const no_life: Life<any, any, any> = Object.freeze({
		tick() {},
		end() {},
	})

	export type LifeFn<Base, Tick, Sc extends Schema, K extends keyof Sc> = (
		(base: Base) => (init: Select<Sc, K>, id: Id) => Life<Tick, Sc, K>
	)

	export class Hub<Base, Tick, Sc extends Schema> {
		kinds = <K extends keyof Sc>(...kinds: K[]) => kinds
		entities = () => new Entities<Sc>()

		system = (name: string, resolver: (base: Base) => PreUnit<Base, Tick, Sc>[]) => (
			new PreSystem<Base, Tick, Sc>(name, resolver)
		)

		executor = (
				base: Base,
				entities: Entities<Sc>,
				preSystem: PreSystem<Base, Tick, Sc>,
			) => (
			new Executor<Base, Tick, Sc>(entities, base, preSystem)
		)

		behavior = (name: string) => ({
			always: (fn: PreBehaviorFn<Base, Tick>) => new PreBehavior<Base, Tick, Sc, any>(name, null, fn),

			select: <K extends keyof Sc>(...kinds: K[]) => ({
				processor: (fn: ProcessorFn<Base, Tick, Sc, K>) => {
					const query = new Query<Sc, K>(kinds)
					const behaviorFn: PreBehaviorFn<Base, Tick> = base => {
						const fn2 = fn(base)
						return tick => {
							const fn3 = fn2(tick)
							for (const [id, state] of query.matches)
								fn3(state as Select<Sc, K>, id)
						}
					}
					return new PreBehavior(name, query, behaviorFn)
				},

				lifecycle: (fn: LifeFn<Base, Tick, Sc, K>) => {
					const query = new Query<Sc, K>(kinds)
					return new PreBehavior<Base, Tick, Sc, K>(name, query, base => {
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
					})
				},
			}),
		})
	}
}

// /////////////////////////////

// type MyBase = {}
// type MyTick = {}
// type MySchema = {
// 	alpha: number
// 	bravo: string
// }

// const hub = new Ecs4.Hub<MyBase, MyTick, MySchema>()
// const {system, behavior} = hub

// const systems = system("humanoid", _base => [
// 	behavior("increment alpha")
// 		.query("alpha")
// 		.processor(_tick => state => {
// 			state.alpha += 1
// 		}),

// 	behavior("cool dynamics")
// 		.query("alpha", "bravo")
// 		.lifecycle(_init => {
// 			return {
// 				tick(_tick, _state) {},
// 				end() {},
// 			}
// 		}),

// 	system("amazing subsystem", () => {
// 		const map = new Map()
// 		return [
// 			behavior("part one")
// 				.query("alpha")
// 				.lifecycle(_init => {
// 					map
// 					return {
// 						tick(_tick, _state) {},
// 						end() {},
// 					}
// 				}),

// 			behavior("part two")
// 				.query("alpha", "bravo")
// 				.lifecycle(_init => {
// 					map
// 					return {
// 						tick(_tick, _state) {},
// 						end() {},
// 					}
// 				}),
// 		]
// 	})
// ])

// const {entities, executor} = hub.setup({}, systems)

