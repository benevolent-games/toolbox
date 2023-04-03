
import {Entities} from "./entities.js"
import {Locals} from "./parts/locals.js"
import {SelectionCache} from "./parts/selection_cache.js"
import {frequency_phases} from "./utils/frequency_phases.js"
import {Behavior, Freq, OverlordParams, Rec} from "./types.js"
import {behavior_is_ready_to_execute} from "./utils/behavior_is_ready_to_execute.js"
import {wire_entity_adding_and_deleting} from "./utils/wire_entity_adding_deleting.js"

export class Overlord<S extends Rec> {
	entities: Entities<S>

	#cache: SelectionCache
	#frequencies: Freq<number>
	#phases: () => Freq<boolean>

	#locals = new Locals()
	#behaviors: Behavior[] = []

	constructor({behaviors, frequencies}: OverlordParams<S>) {
		this.#behaviors = behaviors
		this.#frequencies = frequencies
		this.#phases = frequency_phases(this.#frequencies, () => Date.now())
		this.#cache = new SelectionCache(behaviors)
		this.entities = new Entities<S>(
			wire_entity_adding_and_deleting(this.#cache, this.#locals)
		)
	}

	;*#select_entities(behavior: Behavior) {
		const iterator = this.#cache.select_entities_for_behavior(behavior)

		for (const entity_id of iterator)
			yield [entity_id, this.entities.get(entity_id)] as const
	}

	tick() {
		const phases = this.#phases()

		for (const behavior of this.#behaviors) {
			if (behavior.activity) {
				const [frequency, action] = behavior.activity

				if (behavior_is_ready_to_execute(phases, frequency))
					for (const [id, state] of this.#select_entities(behavior))
						action({
							id,
							state,
							local: this.#locals.get(behavior, id),
						})
			}
		}
	}
}
