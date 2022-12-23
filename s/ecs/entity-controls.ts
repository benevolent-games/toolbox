
import {behaviorEntityCorrelator} from "./behavior-entity-correlator.js"

export class EntityControls<C extends {}>{

	static setupCache(
			map: Map<number, any>,
			correlator: ReturnType<typeof behaviorEntityCorrelator>,
		) {

		const cache = new Map<number, EntityControls<any>>()

		return {

			get(id: number) {
				return cache.get(id)
			},

			entityWasAdded(id: number) {
				cache.set(id, new EntityControls(id, map, correlator))
			},

			entityWasDeleted(id: number) {
				cache.delete(id)
			},

		}
	}

	#map: Map<number, Partial<C>>
	#correlator: ReturnType<typeof behaviorEntityCorrelator>

	constructor(
			public readonly id: number,
			map: Map<number, Partial<C>>,
			correlator: ReturnType<typeof behaviorEntityCorrelator>,
		) {
		this.#map = map
		this.#correlator = correlator
	}

	write(data: Partial<C>) {
		const components: Partial<C> = this.#map.get(this.id) ?? {}
		for (const [key, value] of Object.entries(data)) {
			if (value === undefined)
				delete (<any>components)[key]
			else
				(<any>components)[<keyof C>key] = value
		}
		this.#map.set(this.id, components)

		this.#correlator.update(this.id, components)
	}

	query(fun: (components: Partial<C>) => boolean) {
		return [...this.#map.entries()]
			.filter(
				([xid, components]) =>
					xid !== this.id
						? fun(structuredClone(components))
						: false
			)
	}
}
