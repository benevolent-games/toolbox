
import {Behavior} from "../types.js"

export class Locals {
	#locals = new Map<Behavior, Map<number, any>>()

	get(behavior: Behavior, id: number) {
		return this.#locals.get(behavior)?.get(id)
	}

	set(behavior: Behavior, id: number, local: any) {
			let locals_by_entity_id: Map<number, any>
			const existing_map = this.#locals.get(behavior)

			if (existing_map)
				locals_by_entity_id = existing_map

			else {
				locals_by_entity_id = new Map()
				this.#locals.set(behavior, locals_by_entity_id)
			}

			locals_by_entity_id.set(id, local)
	}
}
