
import {id_counter} from "../tools/id_counter.js"

export namespace Core {
	export type Id = number
	export type Component = any
	export type Kind = string

	export type ComponentSchema = {[kind: Kind]: Component}
	export type AsComponentSchema<CS extends ComponentSchema> = CS

	export type System<T> = (tick: T) => void
	export type PreSystem<S, T> = (starter: S) => System<T>

	export type Selection<CS, K extends keyof CS> = (
		{[P in K]: CS[P]}
			& Partial<CS>
	)

	export type StdStarter<CS extends ComponentSchema> = {
		entities: Entities<CS>
	}

	export type StdTick = {
		tick: number
	}

	export function configure_systems<
			CS extends ComponentSchema,
			Starter extends StdStarter<CS>,
			Tick,
		>() {

		type RezzerLifecycle<K extends keyof CS> = {
			update(state: Selection<CS, K>, tick: Tick): void
			dispose(tick: Tick): void
		}

		type RezzerFn<K extends keyof CS> = (
			(starter: Starter, tick: Tick) => (
				state: Selection<CS, K>,
				id: Id,
			) => RezzerLifecycle<K>
		)

		function system(sys: PreSystem<Starter, Tick>) {
			return sys
		}

		function rezzer<K extends keyof CS>(...kinds: K[]) {
			return (fn: RezzerFn<K>) => {
				const map = new Map<Id, RezzerLifecycle<K>>()
				return system(realm => tick => {
					for (const id of [...map.keys()]) {
						if (!realm.entities.get(id)) {
							const lifecycle = map.get(id)!
							lifecycle.dispose(tick)
							map.delete(id)
						}
					}
					for (const [id, entity] of realm.entities.select(...kinds)) {
						if (map.has(id)) {
							const lifecycle = map.get(id)!
							lifecycle.update(entity, tick)
						}
						else {
							const lifecycle = fn(realm, tick)(entity, id)
							map.set(id, lifecycle)
						}
					}
				})
			}
		}

		return {system, rezzer}
	}

	export class Entities<CS extends ComponentSchema> {
		#id = id_counter()
		#map = new Map<Id, Partial<CS>>()

		has(id: Id) {
			return this.#map.has(id)
		}

		get<E extends Partial<CS>>(id: Id) {
			const entity = this.#map.get(id)
			if (!entity)
				throw new Error(`entity not found "${id}"`)
			return entity as E
		}

		create<E extends Partial<CS>>(entity: E) {
			const id = this.#id()
			this.#map.set(id, entity)
			return id
		}

		*all() {
			yield* this.#map.entries()
		}

		*select<Kind extends keyof CS>(...kinds: Kind[]) {
			for (const [id, entity] of this.#map) {
				const entity_matches_selector = kinds.every(kind => kind in entity)

				if (entity_matches_selector)
					yield [id, entity] as [Id, Selection<CS, Kind>]
			}
		}

		singleton<Kind extends keyof CS>(...kinds: Kind[]) {
			const iterator = this.select(...kinds)
			const {done, value} = iterator.next()

			if (!done)
				console.error(`expected only one entity for singleton, but found more (${kinds.join(", ")})`)

			return value ?? null
		}

		singletonRequired<Kind extends keyof CS>(...kinds: Kind[]) {
			const entity = this.singleton(...kinds)
			if (!entity)
				throw new Error(`missing required singleton (${kinds.join(", ")})`)
			return entity
		}

		delete(id: Id) {
			this.#map.delete(id)
		}

		serialize() {
			return [...this.#map.entries()]
		}

		deserialize(entries: [Id, Partial<CS>][]) {
			return this.#map = new Map(entries)
		}
	}

	export class Executor<Starter, Tick> {
		#systems: System<Tick>[]

		constructor(starter: Starter, systems: PreSystem<Starter, Tick>[]) {
			this.#systems = systems.map(system => system(starter))
		}

		tick(tick: Tick) {
			for (const system of this.#systems)
				system(tick)
		}
	}
}

