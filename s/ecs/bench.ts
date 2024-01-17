
import {human} from "../tools/human.js"
import {id_counter} from "../tools/id_counter.js"
import {measure, measure_average} from "../tools/measure.js"

export namespace EcsCharlie {
	export type Id = number
	export type Schema = {[kind: string]: any}
	export type AsSchema<Sc extends Schema> = Sc
	export type Select<Sc extends Schema, K extends keyof Sc> = {[P in K]: Sc[P]}
	export type AnyEntity = [Id, Schema]
	export type Entity<Sc extends Schema, K extends keyof Sc = keyof Sc> = (
		[Id, Select<Sc, K>]
	)

	class BasicEntities<Sc extends Schema> {
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

	export class Entities<Tick, Sc extends Schema> extends BasicEntities<Sc> {
		#index = new Map<System<Tick, Sc>, Entity<Sc>[]>()

		#deleteFromIndex(id: Id) {
			for (const [system, entities] of this.#index) {
				this.#index.set(system, entities.filter(([eid]) => eid !== id))
			}
		}

		constructor(systems: System<Tick, Sc>[]) {
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

		execute(tick: Tick) {
			for (const [system, entities] of this.#index)
				system.execute(tick, entities)
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
		entities = (systems: System<Tick, Sc>[]) => new Entities<Tick, Sc>(systems)

		systematize = (
			base: Base,
			presystems: ((base: Base) => System<Tick, Sc>)[],
		) => presystems.map(fn => fn(base))

		processor = (<K extends keyof Sc>(...kinds: K[]) =>
			(fn: ProcessorFn<Base, Tick, Sc, K>) => (base: Base) => {
				const fn2 = fn(base)
				return new System<Tick, Sc, K>(kinds, (tick, entities) => {
					const fn3 = fn2(tick)
					for (const [id, state] of entities)
						fn3(state, id)
				})
			}
		)

		lifecycle = (<K extends keyof Sc>(...kinds: K[]) =>
			(fn: LifecycleFn<Base, Tick, Sc, K>) => (base: Base) => {
				const fn2 = fn(base)
				const map = new Map<Id, Life<Tick, Sc, K>>()
				return new System<Tick, Sc, K>(kinds, (tick, entities) => {

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

export namespace EcsEcho {
	export type Id = number
	export type Schema = {[kind: string]: any}
	export type AsSchema<Sc extends Schema> = Sc
	export type Select<Sc extends Schema, K extends keyof Sc> = {[P in K]: Sc[P]}
	export type AnyEntity = [Id, Schema]
	export type Entity<Sc extends Schema, K extends keyof Sc = keyof Sc> = (
		[Id, Select<Sc, K>]
	)

	class BasicEntities<Sc extends Schema> {
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

	export class Entities<Tick, Sc extends Schema> extends BasicEntities<Sc> {
		#index = new Map<System<Tick, Sc>, Map<Id, Partial<Sc>>>()

		constructor(systems: System<Tick, Sc>[]) {
			super()
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

		execute(tick: Tick) {
			for (const [system, entities] of this.#index)
				system.execute(tick, [...entities.entries()] as Entity<Sc>[])
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
		entities = (systems: System<Tick, Sc>[]) => new Entities<Tick, Sc>(systems)

		systematize = (
			base: Base,
			presystems: ((base: Base) => System<Tick, Sc>)[],
		) => presystems.map(fn => fn(base))

		processor = (<K extends keyof Sc>(...kinds: K[]) =>
			(fn: ProcessorFn<Base, Tick, Sc, K>) => (base: Base) => {
				const fn2 = fn(base)
				return new System<Tick, Sc, K>(kinds, (tick, entities) => {
					const fn3 = fn2(tick)
					for (const [id, state] of entities)
						fn3(state, id)
				})
			}
		)

		lifecycle = (<K extends keyof Sc>(...kinds: K[]) =>
			(fn: LifecycleFn<Base, Tick, Sc, K>) => (base: Base) => {
				const fn2 = fn(base)
				const map = new Map<Id, Life<Tick, Sc, K>>()
				return new System<Tick, Sc, K>(kinds, (tick, entities) => {

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

export namespace EcsFoxtrot {
	export type Id = number
	export type Schema = {[kind: string]: any}
	export type AsSchema<Sc extends Schema> = Sc
	export type Select<Sc extends Schema, K extends keyof Sc> = {[P in K]: Sc[P]}
	export type AnyEntity = [Id, Schema]
	export type Entity<Sc extends Schema, K extends keyof Sc = keyof Sc> = (
		[Id, Select<Sc, K>]
	)

	class BasicEntities<Sc extends Schema> {
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
			public kinds: K[],
			public execute: (tick: Tick, entities: Map<Id, Select<Sc, K>>) => void
		) {}

		match(kinds: (keyof Sc)[]) {
			for (const systemKind of this.kinds)
				if (!kinds.includes(systemKind))
					return false
			return true
		}
	}

	export class Entities<Tick, Sc extends Schema> extends BasicEntities<Sc> {
		#index = new Map<System<Tick, Sc>, Map<Id, Partial<Sc>>>()

		constructor(systems: System<Tick, Sc>[]) {
			super()
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

		execute(tick: Tick) {
			for (const [system, entities] of this.#index)
				system.execute(tick, entities as any)
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
		entities = (systems: System<Tick, Sc>[]) => new Entities<Tick, Sc>(systems)

		systematize = (
			base: Base,
			presystems: ((base: Base) => System<Tick, Sc>)[],
		) => presystems.map(fn => fn(base))

		processor = (<K extends keyof Sc>(...kinds: K[]) =>
			(fn: ProcessorFn<Base, Tick, Sc, K>) => (base: Base) => {
				const fn2 = fn(base)
				return new System<Tick, Sc, K>(kinds, (tick, entities) => {
					const fn3 = fn2(tick)
					for (const [id, state] of entities)
						fn3(state as Select<Sc, K>, id)
				})
			}
		)

		lifecycle = (<K extends keyof Sc>(...kinds: K[]) =>
			(fn: LifecycleFn<Base, Tick, Sc, K>) => (base: Base) => {
				const fn2 = fn(base)
				const map = new Map<Id, Life<Tick, Sc, K>>()
				return new System<Tick, Sc, K>(kinds, (tick, entities) => {

					// prune missing entities
					for (const id of [...map.keys()]) {
						if (!entities.has(id)) {
							const lifecycle = map.get(id)!
							lifecycle.dispose(tick)
							map.delete(id)
						}
					}

					for (const [id, state] of entities) {

						// update existing entities
						if (map.has(id)) {
							const lifecycle = map.get(id)!
							lifecycle.update(tick, state, id)
						}

						// initialize entities
						else {
							const lifecycle = fn2(state, id)
							map.set(id, lifecycle)
						}
					}
				})
			}
		)
	}
}

export namespace EcsAlpha {
	export type Id = number
	export type Schema = {[kind: string]: any}
	export type AsSchema<Sc extends Schema> = Sc
	export type Select<Sc extends Schema, K extends keyof Sc> = {[P in K]: Sc[P]}
	export type AnyEntity = [Id, Schema]
	export type Entity<Sc extends Schema, K extends keyof Sc = keyof Sc> = (
		[Id, Select<Sc, K>]
	)

	class BasicEntities<Sc extends Schema> {
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

	export class Entities<Tick, Sc extends Schema> extends BasicEntities<Sc> {

		constructor(private systems: System<Tick, Sc>[]) {
			super()
		}

		execute(tick: Tick) {
			for (const system of this.systems) {
				const ents: Entity<Sc>[] = []
				for (const e of this.all()) {
					if (system.match(Object.keys(e[1])))
						ents.push(e as Entity<Sc>)
				}
				system.execute(tick, ents)
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
		entities = (systems: System<Tick, Sc>[]) => new Entities<Tick, Sc>(systems)

		systematize = (
			base: Base,
			presystems: ((base: Base) => System<Tick, Sc>)[],
		) => presystems.map(fn => fn(base))

		processor = (<K extends keyof Sc>(...kinds: K[]) =>
			(fn: ProcessorFn<Base, Tick, Sc, K>) => (base: Base) => {
				const fn2 = fn(base)
				return new System<Tick, Sc, K>(kinds, (tick, entities) => {
					const fn3 = fn2(tick)
					for (const [id, state] of entities)
						fn3(state, id)
				})
			}
		)

		lifecycle = (<K extends keyof Sc>(...kinds: K[]) =>
			(fn: LifecycleFn<Base, Tick, Sc, K>) => (base: Base) => {
				const fn2 = fn(base)
				const map = new Map<Id, Life<Tick, Sc, K>>()
				return new System<Tick, Sc, K>(kinds, (tick, entities) => {

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

type MySchema = EcsCharlie.AsSchema<{
	a: number
	b: string
	c: boolean
}>

type MyBase = {}
type MyTick = {}

const iterations = 1000
const entity_count = 5_000

//
// TEST ALPHA
//
console.log(" - grand total", measure(() => {
	const ecs = new EcsAlpha.Hub<MyBase, MyTick, MySchema>()
	const systems = ecs.systematize({}, [
		ecs.processor("a")(_base => _tick => state => {
			state.a++
		}),
		ecs.processor("a", "b")(_base => _tick => state => {
			state.b = state.a.toString()
		}),
		ecs.processor("c")(_base => _tick => state => {
			state.c = !state.c
		}),
	])
	const entities = ecs.entities(systems)

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
	console.log(` - system execution ${measure_average(iterations, () => entities.execute({}))}`)
	console.log(` - delete all ${measure(() => [...entities.all()].forEach(([id]) => entities.delete(id)))}`)
}))

//
// TEST CHARLIE
//
console.log(" - grand total", measure(() => {
	const ecs = new EcsCharlie.Hub<MyBase, MyTick, MySchema>()
	const systems = ecs.systematize({}, [
		ecs.processor("a")(_base => _tick => state => {
			state.a++
		}),
		ecs.processor("a", "b")(_base => _tick => state => {
			state.b = state.a.toString()
		}),
		ecs.processor("c")(_base => _tick => state => {
			state.c = !state.c
		}),
	])
	const entities = ecs.entities(systems)

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
	console.log(` - system execution ${measure_average(iterations, () => entities.execute({}))}`)
	console.log(` - delete all ${measure(() => [...entities.all()].forEach(([id]) => entities.delete(id)))}`)
}))

//
// TEST ECHO
//
console.log(" - grand total", measure(() => {
	const ecs = new EcsEcho.Hub<MyBase, MyTick, MySchema>()
	const systems = ecs.systematize({}, [
		ecs.processor("a")(_base => _tick => state => {
			state.a++
		}),
		ecs.processor("a", "b")(_base => _tick => state => {
			state.b = state.a.toString()
		}),
		ecs.processor("c")(_base => _tick => state => {
			state.c = !state.c
		}),
	])
	const entities = ecs.entities(systems)

	console.log("\necs echo:")
	console.log(` - entity creation ${measure_average(entity_count, i => {
		entities.create({})
		entities.create({a: i})
		entities.create({a: i, b: i.toString()})
		entities.create({a: i, b: i.toString(), c: true})
		entities.create({b: i.toString(), c: true})
		entities.create({c: true})
	})}`)
	console.log(` - component count ${human.number([...entities.all()].reduce((p, c) => p + Object.keys(c[1]).length, 0))}`)
	console.log(` - system execution ${measure_average(iterations, () => entities.execute({}))}`)
	console.log(` - delete all ${measure(() => [...entities.all()].forEach(([id]) => entities.delete(id)))}`)
}))

//
// TEST FOXTROT
//
console.log(" - grand total", measure(() => {
	const ecs = new EcsEcho.Hub<MyBase, MyTick, MySchema>()
	const systems = ecs.systematize({}, [
		ecs.processor("a")(_base => _tick => state => {
			state.a++
		}),
		ecs.processor("a", "b")(_base => _tick => state => {
			state.b = state.a.toString()
		}),
		ecs.processor("c")(_base => _tick => state => {
			state.c = !state.c
		}),
	])
	const entities = ecs.entities(systems)

	console.log("\necs foxtrot:")
	console.log(` - entity creation ${measure_average(entity_count, i => {
		entities.create({})
		entities.create({a: i})
		entities.create({a: i, b: i.toString()})
		entities.create({a: i, b: i.toString(), c: true})
		entities.create({b: i.toString(), c: true})
		entities.create({c: true})
	})}`)
	console.log(` - component count ${human.number([...entities.all()].reduce((p, c) => p + Object.keys(c[1]).length, 0))}`)
	console.log(` - system execution ${measure_average(iterations, () => entities.execute({}))}`)
	console.log(` - delete all ${measure(() => [...entities.all()].forEach(([id]) => entities.delete(id)))}`)
}))

