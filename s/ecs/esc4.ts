
import {pub} from "@benev/slate"
import {id_counter} from "../tools/id_counter.js"

export namespace Ecs4 {
	export type Id = number
	export type Schema = Record<string, any>
	export type AsSchema<Sc extends Schema> = Sc
	export type Kinds<Sc extends Schema> = (keyof Sc)[]
	export type Select<Sc extends Schema, K extends Kinds<Sc>> = {[P in K[number]]: Sc[P]}
	export type Entry<State> = [Id, State]

	export class Entities<Sc extends Schema> {
		#id = id_counter()
		#map = new Map<Id, Partial<Sc>>()

		onCreated = pub<[Id, Partial<Sc>]>()
		onUpdated = pub<[Id, Partial<Sc>]>()
		onDeleted = pub<Id>()

		get<K extends Kinds<Sc>>(id: Id) {
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

		query<K extends Kinds<Sc>>(...kinds: K) {
			return new Query<Sc, K>(kinds, this)
		}
	}

	export class Query<Sc extends Schema, K extends Kinds<Sc>> {
		static match(kinds: Kinds<any>, [,state]: Entry<any>) {
			const skinds = Object.keys(state) as (keyof any)[]
			for (const kind of kinds)
				if (!skinds.includes(kind))
					return false
			return true
		}

		#disposables: (() => void)[] = []
		#map = new Map<Id, Partial<Sc>>()
		#array: Entry<Partial<Sc>>[] = []

		onMatch = pub<Entry<Partial<Sc>>>()
		onUnmatch = pub<Id>()

		constructor(kinds: K, entities: Entities<Sc>) {
			for (const entry of entities.all()) {
				if (Query.match(kinds, entry))
					this.#add(entry)
			}

			this.#disposables.push(
				entities.onCreated(entry => {
					if (Query.match(kinds, entry))
						this.#add(entry)
				})
			)

			this.#disposables.push(
				entities.onUpdated(entry => {
					const [id] = entry
					const matches = Query.match(kinds, entry)
					const hasChanged = matches !== this.#map.has(id)
					if (hasChanged) {
						if (matches)
							this.#add(entry)
						else
							this.#remove(id)
					}
				})
			)

			this.#disposables.push(
				entities.onDeleted(id => {
					this.#remove(id)
				})
			)
		}

		get matches() {
			return this.#array
		}

		#add(entry: Entry<Partial<Sc>>) {
			const [id, state] = entry
			this.#map.set(id, state)
			this.#array = [...this.#map]
			this.onMatch.publish(entry)
		}

		#remove(id: Id) {
			this.#map.delete(id)
			this.#array = [...this.#map]
			this.onUnmatch.publish(id)
		}

		dispose() {
			for (const dispose of this.#disposables)
				dispose()
		}
	}
}

