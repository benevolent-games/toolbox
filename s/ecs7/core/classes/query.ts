
import {Entity} from "./entity.js"
import {Selector} from "../types.js"
import {pubsub} from "../../../tools/pubsub.js"

const consider = Symbol()
const add = Symbol()
const remove = Symbol()

export class Query<Sel extends Selector = Selector> {
	static internal = {consider, add, remove} as const

	#matches = new Set<Entity>()
	readonly added = pubsub<[Entity]>()
	readonly removed = pubsub<[Entity]>()

	get matches() {
		return this.#matches.entries()
	}

	constructor(public readonly selector: Sel) {}

	[consider](entity: Entity) {
		const was_matching = this.#matches.has(entity)
		const is_matching = entity.has(this.selector)
		const changed = is_matching !== was_matching
		if (changed) {
			if (is_matching)
				this[add](entity)
			else
				this[remove](entity)
		}
		return is_matching
	}

	[add](entity: Entity) {
		this.#matches.add(entity)
		this.added.publish(entity)
	}

	[remove](entity: Entity) {
		this.#matches.delete(entity)
		this.removed.publish(entity)
	}
}

