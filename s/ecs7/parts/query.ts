
import {Entity} from "./entity.js"
import {Selector} from "./types.js"
import {pubsub} from "../../tools/pubsub.js"

export class Query<Sel extends Selector = Selector> {
	#matches = new Set<Entity<Sel>>()

	readonly onAdded = pubsub<[Entity<Sel>]>()
	readonly onRemoved = pubsub<[Entity<Sel>]>()

	get matches() {
		return this.#matches.values()
	}

	constructor(public readonly selector: Sel) {}

	consider(entity: Entity) {
		const was_matching = this.#matches.has(entity as Entity<Sel>)
		const is_matching = entity.has(this.selector)
		const changed = is_matching !== was_matching
		if (changed) {
			if (is_matching)
				this.add(entity)
			else
				this.remove(entity)
		}
		return is_matching
	}

	add(entity: Entity<any>) {
		if (!this.#matches.has(entity)) {
			this.#matches.add(entity)
			this.onAdded.publish(entity)
		}
	}

	remove(entity: Entity<any>) {
		if (this.#matches.has(entity)) {
			this.#matches.delete(entity)
			this.onRemoved.publish(entity)
		}
	}
}

