
import {Entities} from "./entities.js"
import {SelectionCache} from "./cache/selection_cache.js"
import {frequency_phases} from "./utils/frequency_phases.js"
import {Behavior, Freq, OverlordParams, Rec} from "./types.js"
import {behavior_is_ready_to_execute} from "./utils/behavior_is_ready_to_execute.js"

export class Overlord<S extends Rec> {
	#frequencies: Freq<number>
	#behaviors: Behavior[] = []
	#cache: SelectionCache
	#locals = new Map<Behavior, Map<number, any>>()
	#phases: () => Freq<boolean>

	constructor({behaviors, frequencies}: OverlordParams<S>) {
		this.#behaviors = behaviors
		this.#frequencies = frequencies
		this.#phases = frequency_phases(this.#frequencies, () => Date.now())
		this.#cache = new SelectionCache(behaviors)
	}

	readonly entities = new Entities<S>({
		on_add: (id, state) => {
			this.#cache.cache_entity(id, state)
			this.#execute_create_functions(id, state)
		},
		on_delete: (id, state) => {
			this.#cache.uncache_entity(id)
			this.#execute_delete_functions(id, state)
		},
	})

	#execute_create_functions(id: number, state: Rec) {
		for (const behavior of this.#cache.get_behaviors_for_entity(id)) {
			const local = behavior.create(state, id)
			this.locals.set(behavior, id, local)
		}
	}

	#execute_delete_functions(id: number, state: Rec) {
		for (const behavior of this.#cache.get_behaviors_for_entity(id)) {
			const local = this.locals.get(behavior, id)
			behavior.delete(state, local, id)
		}
	}

	locals = {
		get: (behavior: Behavior, id: number): any => {
			return this.#locals.get(behavior)?.get(id)
		},
		set: (behavior: Behavior, id: number, local: any) => {
			let locals: Map<number, any>
			const existing_locals = this.#locals.get(behavior)

			if (existing_locals)
				locals = existing_locals

			else {
				locals = new Map()
				this.#locals.set(behavior, locals)
			}

			locals.set(id, local)
		},
	}

	tick() {
		const phases = this.#phases()
		const {entities} = this

		for (const behavior of this.#behaviors) {
			if (behavior.activity) {
				const [frequency, action] = behavior.activity
				if (behavior_is_ready_to_execute(phases, frequency))
					for (const [id, entity] of entities.select(behavior.selector))
						action(entity, id, this.locals.get(behavior, id))
			}
		}
	}
}
