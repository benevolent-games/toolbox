
import {Behavior, Rec} from "../types.js"
import {selectors_are_the_same} from "../utils/selectors_are_the_same.js"
import {entity_matches_selector} from "../utils/entity_matches_selector.js"

export class SelectionCache {
	#all_behaviors: Behavior[]
	#selector_by_behavior = new Map<Behavior, string[]>()
	#entities_by_selector = new Map<string[], Set<number>>()
	#behaviors_by_entity = new Map<number, Set<Behavior>>()

	constructor(behaviors: Behavior[]) {
		this.#all_behaviors = behaviors

		for (const behavior of behaviors)
			this.#selector_by_behavior.set(
				behavior,
				this.#dedupe_selector(behavior.selector),
			)

		for (const selector of this.#all_known_selectors)
			this.#entities_by_selector.set(selector, new Set)
	}

	get #all_known_selectors() {
		return [...this.#selector_by_behavior.values()]
	}

	#dedupe_selector(selector: string[]) {
		return (
			this.#all_known_selectors
				.find(cached => selectors_are_the_same(selector, cached))
		) ?? selector
	}

	cache_entity(id: number, state: Rec) {
		for (const [selector, entity_ids] of this.#entities_by_selector)
			if (entity_matches_selector(state, selector))
				entity_ids.add(id)

		const behaviors_for_this_entity = new Set<Behavior>()

		for (const behavior of this.#all_behaviors) {
			const selector = this.#selector_by_behavior.get(behavior)!
			const entities = this.#entities_by_selector.get(selector)!
			if (entities.has(id))
				behaviors_for_this_entity.add(behavior)
		}

		this.#behaviors_by_entity.set(id, behaviors_for_this_entity)
	}

	uncache_entity(id: number) {
		for (const [,entity_ids] of this.#entities_by_selector)
			entity_ids.delete(id)

		this.#behaviors_by_entity.delete(id)
	}

	get_behaviors_for_entity(id: number) {
		return [...this.#behaviors_by_entity.get(id)!]
	}

	;*select_entities_for_behavior(behavior: Behavior) {
		const selector = this.#selector_by_behavior.get(behavior)!
		const entities = this.#entities_by_selector.get(selector)!
		yield* entities.values()
	}
}
