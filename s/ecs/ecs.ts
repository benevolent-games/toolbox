
import {id_counter} from "../tools/id_counter.js"

export namespace Ecs {
	export type Id = number
	export type Component = any
	export type Kind = string

	export type Schema = {[kind: Kind]: Component}
	export type AsSchema<Sc extends Schema> = Sc

	export class Entities<Sc extends Schema> {
		#id = id_counter()
		#states = new Map<Id, Partial<Sc>>()
		#cache = new Map<System<any, Sc, keyof Sc>, Set<Id>>()

		constructor(pipelines: Pipeline<any, Sc>[]) {
			for (const pipeline of pipelines)
				for (const system of pipeline.systems)
					this.#cache.set(system, new Set())
		}

		has(id: Id) {
			return this.#states.has(id)
		}

		get<State extends Partial<Sc>>(id: Id) {
			const state = this.#states.get(id)
			if (!state)
				throw new Error(`entity not found "${id}"`)
			return state as State
		}

		#updateCache<State extends Partial<Sc>>(id: Id, state: State) {
			for (const [system, ids] of this.#cache) {
				if (system.match(Object.keys(state)))
					ids.add(id)
				else
					ids.delete(id)
			}
		}

		create<State extends Partial<Sc>>(state: State) {
			const id = this.#id()
			this.#states.set(id, state)
			this.#updateCache(id, state)
			return id
		}

		update<State extends Partial<Sc>>(id: Id, state: State) {
			this.#states.set(id, state)
			this.#updateCache(id, state)
		}

		delete(id: Id) {
			this.#states.delete(id)
			for (const [,ids] of this.#cache)
				ids.delete(id)
		}

		*all() {
			yield* this.#states.entries()
		}
	}

	export type Selection<Sc extends Schema, K extends keyof Sc> = {
		[P in K]: Sc[P]
	}

	export type EntityReport<Sc extends Schema, K extends keyof Sc> = [Id, Selection<Sc, K>]

	export type SystemFn<Base, Tick, Sc extends Schema, K extends keyof Sc> = (
		(base: Base) => (tick: Tick, entities: EntityReport<Sc, K>[]) => void
	)

	export type ProcessorFn<
			Base,
			Tick,
			Sc extends Schema,
			Kinds extends keyof Sc,
		> = (
		(base: Base) => (tick: Tick) => (state: Selection<Sc, Kinds>, id: Id) => void
	)

	export type Lifecycle<Tick, Sc extends Schema, Kinds extends keyof Sc> = {
		update: (tick: Tick, state: Selection<Sc, Kinds>, id: Id) => void
		dispose: (tick: Tick) => void
	}

	export type LifecycleFn<
			Base,
			Tick,
			Sc extends Schema,
			Kinds extends keyof Sc,
		> = (
		(base: Base) =>
			(init: Selection<Sc, Kinds>, id: Id) =>
				Lifecycle<Tick, Sc, Kinds>
	)

	export class System<
			Tick,
			Sc extends Schema,
			K extends keyof Sc,
		> {

		kinds: Set<K>

		constructor(
				kinds: K[],
				public execute: (tick: Tick, entities: EntityReport<Sc, K>[]) => void,
			) {

			this.kinds = new Set(kinds)
		}

		match(kinds: (keyof Sc)[]) {
			for (const k of this.kinds)
				if (!kinds.includes(k))
					return false
			return true
		}
	}

	export class Pipeline<Tick, Sc extends Schema> {
		spec = new Map<System<Tick, Sc, keyof Sc>, Set<keyof Sc>>()
		kinds = new Set<keyof Sc>()

		constructor(public systems: System<Tick, Sc, keyof Sc>[]) {
			for (const system of systems) {
				const set = new Set<keyof Sc>()
				this.spec.set(system, set)
				for (const kind of system.kinds) {
					set.add(kind)
					this.kinds.add(kind)
				}
			}
		}

		execute(tick: Tick, entities: EntityReport<Sc, keyof Sc>[]) {
			for (const system of this.systems)
				system.execute(tick, entities)
		}
	}

	export class EntityDealer<Sc extends Schema> {
		constructor(public entities: Entities<Sc>) {}
	}

	export class Hub<
			Base,
			Tick,
			Sc extends Schema,
		> {

		pipeline = (
			(...fns: ((base: Base) => System<Tick, Sc, keyof Sc>)[]) =>
				(base: Base) =>
					new Pipeline<Tick, Sc>(fns.map(p => p(base)))
		)

		system = (
			<K extends keyof Sc>(...kinds: K[]) =>
				(fn: SystemFn<Base, Tick, Sc, K>) =>
					(base: Base) =>
						new System<Tick, Sc, K>(kinds, fn(base))
		)

		processor = (
			<K extends keyof Sc>(...kinds: K[]) =>
				(fn: ProcessorFn<Base, Tick, Sc, K>) =>
					this.system<K>(...kinds)(base => {
						const fn2 = fn(base)
						return tick => {
							const fn3 = fn2(tick)
							for (const [id, state] of [] as any)
								fn3(state, id)
						}
					})
		)

		lifecycle = (
			<K extends keyof Sc>(...kinds: K[]) =>
				(fn: LifecycleFn<Base, Tick, Sc, K>) => (base: Base) => {
					const fn2 = fn(base)
					const map = new Map<Id, Lifecycle<Tick, Sc, K>>
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

