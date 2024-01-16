
import {loop} from "../tools/loopy.js"
import {id_counter} from "../tools/id_counter.js"
import { measure, measure_average } from "../tools/measure.js"
import { human } from "../tools/human.js"

export type Id = number
export type Schema = {[kind: string]: any}
export type AsSchema<Sc extends Schema> = Sc
export type Select<Sc extends Schema, K extends keyof Sc> = {[P in K]: Sc[P]}
export type Entity<Sc extends Schema, K extends keyof Sc> = [Id, Select<Sc, K>]
export type AnyEntity = [Id, any]

export class Entities<Sc extends Schema> {
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

export class System<Sc extends Schema, K extends keyof Sc> {
	constructor(
		public kinds: K[],
		public execute: (entities: Entity<Sc, K>[]) => void
	) {}

	match(kinds: (keyof Sc)[]) {
		for (const systemKind of this.kinds)
			if (!kinds.includes(systemKind))
				return false
		return true
	}
}

export namespace EcsAlpha {

	export class Hub<Sc extends Schema> {
		entities = () => new Entities<Sc>()

		processor = (
			<K extends keyof Sc>(...kinds: K[]) =>
				(fn: () => (state: Select<Sc, K>, id: Id) => void) => {
					const fn2 = fn()
					return new System<Sc, K>(kinds, entities => {
						for (const [id, state] of entities)
							fn2(state, id)
					})
				}
		)

		#get_entities_for_system(entities: Entities<Sc>, system: System<Sc, keyof Sc>) {
			const matching_entities: Entity<Sc, keyof Sc>[] = []

			for (const entity of entities.all()) {
				const [,state] = entity
				if (system.match(Object.keys(state)))
					matching_entities.push(entity as Entity<Sc, keyof Sc>)
			}

			return matching_entities
		}

		execute(entities: Entities<Sc>, systems: System<Sc, keyof Sc>[]) {
			for (const system of systems) {
				const matching_entities = this.#get_entities_for_system(entities, system)
				system.execute(matching_entities)
			}
		}
	}
}

export namespace EcsBravo {

	export class EntitiesWithIndex<Sc extends Schema> extends Entities<Sc> {
		#index = new Map<System<Sc, keyof Sc>, Set<Id>>()

		constructor(systems: System<Sc, keyof Sc>[]) {
			super()
			for (const system of systems)
				this.#index.set(system, new Set())
		}

		create<State extends Partial<Sc>>(state: State) {
			const id = super.create(state)
			for (const [system, ids] of this.#index) {
				if (system.match(Object.keys(state)))
					ids.add(id)
				else
					ids.delete(id)
			}
			return id
		}

		delete(id: Id) {
			super.delete(id)
			for (const [,set] of this.#index)
				set.delete(id)
		}

		execute() {
			for (const [system, ids] of this.#index) {
				const entities: Entity<Sc, keyof Sc>[] = []

				for (const id of ids)
					entities.push([id, this.get(id)])

				system.execute(entities)
			}
		}
	}

	export class Hub<Sc extends Schema> {
		entities = (...systems: System<Sc, keyof Sc>[]) => new EntitiesWithIndex<Sc>(systems)

		processor = (
			<K extends keyof Sc>(...kinds: K[]) =>
				(fn: () => (state: Select<Sc, K>, id: Id) => void) => {
					const fn2 = fn()
					return new System<Sc, K>(kinds, entities => {
						for (const [id, state] of entities)
							fn2(state, id)
					})
				}
		)
	}
}

export namespace EcsCharlie {

	export class EntitiesWithIndex<Sc extends Schema> extends Entities<Sc> {
		#index = new Map<System<Sc, keyof Sc>, Entity<Sc, keyof Sc>[]>()
		#deleteFromIndex(id: Id) {
			for (const [system, entities] of this.#index) {
				this.#index.set(system, entities.filter(([eid]) => eid !== id))
			}
		}

		constructor(systems: System<Sc, keyof Sc>[]) {
			super()
			for (const system of systems)
				this.#index.set(system, [])
		}

		create<State extends Partial<Sc>>(state: State) {
			const id = super.create(state)
			for (const [system, entities] of this.#index) {
				if (system.match(Object.keys(state)))
					entities.push([id, state as any])
				else
					this.#deleteFromIndex(id)
			}
			return id
		}

		delete(id: Id) {
			super.delete(id)
			this.#deleteFromIndex(id)
		}

		execute() {
			for (const [system, entities] of this.#index)
				system.execute(entities)
		}
	}

	export class Hub<Sc extends Schema> {
		entities = (...systems: System<Sc, keyof Sc>[]) => new EntitiesWithIndex<Sc>(systems)

		processor = (
			<K extends keyof Sc>(...kinds: K[]) =>
				(fn: () => (state: Select<Sc, K>, id: Id) => void) => {
					const fn2 = fn()
					return new System<Sc, K>(kinds, entities => {
						for (const [id, state] of entities)
							fn2(state, id)
					})
				}
		)
	}
}

export namespace EcsDelta {

	export class EntitiesWithIndex<Sc extends Schema> extends Entities<Sc> {
		#index = new Map<System<Sc, keyof Sc>, Map<Id, Partial<Sc>>>()
		#deleteFromIndex(id: Id) {
			for (const entities of this.#index.values())
				entities.delete(id)
		}

		constructor(systems: System<Sc, keyof Sc>[]) {
			super()
			for (const system of systems)
				this.#index.set(system, new Map())
		}

		create<State extends Partial<Sc>>(state: State) {
			const id = super.create(state)
			for (const [system, entities] of this.#index) {
				if (system.match(Object.keys(state)))
					entities.set(id, state)
				else
					entities.delete(id)
			}
			return id
		}

		delete(id: Id) {
			super.delete(id)
			this.#deleteFromIndex(id)
		}

		execute() {
			for (const [system, entities] of this.#index)
				system.execute([...entities.entries()] as any)
		}
	}

	export class Hub<Sc extends Schema> {
		entities = (...systems: System<Sc, keyof Sc>[]) => new EntitiesWithIndex<Sc>(systems)

		processor = (
			<K extends keyof Sc>(...kinds: K[]) =>
				(fn: () => (state: Select<Sc, K>, id: Id) => void) => {
					const fn2 = fn()
					return new System<Sc, K>(kinds, entities => {
						for (const [id, state] of entities)
							fn2(state, id)
					})
				}
		)
	}
}

type MySchema = AsSchema<{
	a: number
	b: string
	c: boolean
}>

const iterations = 1000
const entity_count = 5_000

//
// TEST ALPHA
//
{
	const hub = new EcsAlpha.Hub<MySchema>()
	const systems = [
		hub.processor("a")(() => state => {
			state.a++
		}),
		hub.processor("a", "b")(() => state => {
			state.b = state.a.toString()
		}),
		hub.processor("c")(() => state => {
			state.c = !state.c
		}),
	]
	const entities = hub.entities()

	console.log("\necs alpha:")
	console.log(` - entity creation ${measure_average(entity_count, i => {
		entities.create({})
		entities.create({a: i})
		entities.create({a: i, b: i.toString()})
		entities.create({a: i, b: i.toString(), c: true})
		entities.create({b: i.toString(), c: true})
		entities.create({c: true})
	})}`)
	console.log(` - component count ${human.number([...entities.all()].reduce((p, c) => p + Object.keys(c[1]).length, 0))}`)
	console.log(` - system execution ${measure_average(iterations, () => hub.execute(entities, systems))}`)
}

//
// TEST BRAVO
//
{
	const hub = new EcsBravo.Hub<MySchema>()
	const entities = hub.entities(
		hub.processor("a")(() => state => {
			state.a++
		}),
		hub.processor("a", "b")(() => state => {
			state.b = state.a.toString()
		}),
		hub.processor("c")(() => state => {
			state.c = !state.c
		}),
	)

	console.log("\necs bravo:")
	console.log(` - entity creation ${measure_average(entity_count, i => {
		entities.create({})
		entities.create({a: i})
		entities.create({a: i, b: i.toString()})
		entities.create({a: i, b: i.toString(), c: true})
		entities.create({b: i.toString(), c: true})
		entities.create({c: true})
	})}`)
	console.log(` - component count ${human.number([...entities.all()].reduce((p, c) => p + Object.keys(c[1]).length, 0))}`)
	console.log(` - system execution ${measure_average(iterations, () => entities.execute())}`)
}

//
// TEST CHARLIE
//
{
	const hub = new EcsCharlie.Hub<MySchema>()
	const entities = hub.entities(
		hub.processor("a")(() => state => {
			state.a++
		}),
		hub.processor("a", "b")(() => state => {
			state.b = state.a.toString()
		}),
		hub.processor("c")(() => state => {
			state.c = !state.c
		}),
	)

	console.log("\necs charlie:")
	console.log(` - entity creation ${measure_average(entity_count, i => {
		entities.create({})
		entities.create({a: i})
		entities.create({a: i, b: i.toString()})
		entities.create({a: i, b: i.toString(), c: true})
		entities.create({b: i.toString(), c: true})
		entities.create({c: true})
	})}`)
	console.log(` - component count ${human.number([...entities.all()].reduce((p, c) => p + Object.keys(c[1]).length, 0))}`)
	console.log(` - system execution ${measure_average(iterations, () => entities.execute())}`)
}

//
// TEST DELTA
//
{
	const hub = new EcsDelta.Hub<MySchema>()
	const entities = hub.entities(
		hub.processor("a")(() => state => {
			state.a++
		}),
		hub.processor("a", "b")(() => state => {
			state.b = state.a.toString()
		}),
		hub.processor("c")(() => state => {
			state.c = !state.c
		}),
	)

	console.log("\necs delta:")
	console.log(` - entity creation ${measure_average(entity_count, i => {
		entities.create({})
		entities.create({a: i})
		entities.create({a: i, b: i.toString()})
		entities.create({a: i, b: i.toString(), c: true})
		entities.create({b: i.toString(), c: true})
		entities.create({c: true})
	})}`)
	console.log(` - component count ${human.number([...entities.all()].reduce((p, c) => p + Object.keys(c[1]).length, 0))}`)
	console.log(` - system execution ${measure_average(iterations, () => entities.execute())}`)
}

