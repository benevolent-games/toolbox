
import {Entity} from "./entity.js"
import {pubsub} from "../../tools/pubsub.js"
import {CHandle, Id, Selector} from "./types.js"

const consider = Symbol()
const add = Symbol()
const remove = Symbol()

export class Query<Sel extends Selector = Selector> {
	static internal = {consider, add, remove} as const

	#matches = new Map<Id, CHandle<Sel>>()
	readonly added = pubsub<[CHandle<Sel>, Id]>()
	readonly removed = pubsub<[CHandle<Sel>, Id]>()

	get matches() {
		return this.#matches.entries()
	}

	constructor(public readonly selector: Sel) {}

	[consider](entity: Entity) {
		const was_matching = this.#matches.has(entity.id)
		const is_matching = entity.match(this.selector)
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
		this.#matches.set(entity.id, entity.data)
		this.added.publish(entity.data, entity.id)
	}

	[remove](entity: Entity) {
		this.#matches.delete(entity.id)
		this.removed.publish(entity.data, entity.id)
	}
}

