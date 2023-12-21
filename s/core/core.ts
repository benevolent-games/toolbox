
import {generate_id} from "@benev/slate"

export namespace Core {
	export const freshId = () => generate_id(32)

	export type Id = string
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

	export function configure_systems<Starter, Tick>() {
		return function system(sys: PreSystem<Starter, Tick>) {
			return sys
		}
	}

	export class Entities<CS extends ComponentSchema> {
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
			const id = freshId()
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

