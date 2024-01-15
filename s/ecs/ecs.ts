
import {id_counter} from "../tools/id_counter.js"

export namespace Ecs {
	export type Id = number
	export type Component = any
	export type Kind = string

	export type Schema = {[kind: Kind]: Component}
	export type AsSchema<Sc extends Schema> = Sc





	export class Entities<Sc extends Schema> {
		#id = id_counter()
		#map = new Map<Id, Partial<Sc>>

		has(id: Id) {
			return this.#map.has(id)
		}

		get<E extends Partial<Sc>>(id: Id) {
			const entity = this.#map.get(id)
			if (!entity)
				throw new Error(`entity not found "${id}"`)
			return entity as E
		}

		create<E extends Partial<Sc>>(entity: E) {
			const id = this.#id()
			this.#map.set(id, entity)
			return id
		}

		delete(id: Id) {
			this.#map.delete(id)
		}

		*all() {
			yield* this.#map.entries()
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
		dispose: () => void
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

		constructor(
			public kinds: K[],
			public execute: (tick: Tick, entities: EntityReport<Sc, K>[]) => void,
		) {}

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

		// update_entity_in_cache(id: Id, state: Partial<Sc>) {
		// 	const kinds = Object.keys(state)
		// 	for (const system of this.systems) {
		// 		const set = this.#cache.get(system)!
		// 		if (system.match(kinds))
		// 			set.add(id)
		// 		else
		// 			set.delete(id)
		// 	}
		// }

		execute(tick: Tick, entities: EntityReport<Sc, keyof Sc>[]) {
			for (const system of this.systems)
				system.execute(tick, entities)
		}
	}




	export class EntityDealer<Sc extends Schema> {
		constructor(public entities: Entities<Sc>) {}

	}



	export class SystemHub<
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

		// lifecycle = (
		// 	<K extends keyof Sc>(...kinds: K[]) =>
		// 		(fn: LifecycleFn<Base, Tick, Sc, K>) => {
		// 			return (base: Base) => {
		// 				const fn2 = fn(base)
		// 				const map = new Map<Id, Lifecycle<Tick, Sc, K>>
		// 				const system = new System<Tick, Sc>(new Set(kinds), tick => {
		// 					for (const id of [...map.keys()]) {
		// 						if (system)
		// 					}
		// 				})
		// 			}
		// 		}
		// 			// this.system<K>(...kinds)(base => {
		// 			// 	const fn2 = fn(base)
		// 			// })
		// )
	}
}

