
import {Locals} from "../parts/locals.js"
import {EntityCallbacks} from "../types.js"
import {SelectionCache} from "../parts/selection_cache.js"

export function wire_entity_adding_and_deleting(
		cache: SelectionCache,
		locals: Locals,
	): EntityCallbacks<any> {
	return {

		on_add(id, state) {
			cache.cache_entity(id, state)
			for (const behavior of cache.get_behaviors_for_entity(id)) {
				const local = behavior.create(state, id)
				locals.set(behavior, id, local)
			}
		},

		on_delete(id, state) {
			for (const behavior of cache.get_behaviors_for_entity(id)) {
				const local = locals.get(behavior, id)
				behavior.delete(state, local, id)
			}
		},
	}
}
