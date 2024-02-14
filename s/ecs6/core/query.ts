
import {Entity} from "./entity.js"
import {pubb} from "../../tools/pubb.js"
import {CClass, CHandle, Id, Selector} from "./types.js"

const consider = Symbol()
const add = Symbol()
const remove = Symbol()

export class Query<Sel extends Selector = Selector> {
	static internal = {consider, add, remove} as const

	#classes: CClass[] = []
	#matches = new Map<Id, CHandle<Sel>>()
	readonly added = pubb<[CHandle<Sel>, Id]>()
	readonly removed = pubb<[CHandle<Sel>, Id]>()

	get matches() {
		return this.#matches.entries()
	}

	constructor(public readonly selector: Sel) {
		this.#classes = Object.values(selector)
	}

	[consider](entity: Entity) {
		if (entity.match(this.#classes)) {
			if (!this.#matches.has(entity.id))
				this[add](entity)
		}
		else
			this[remove](entity)
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

