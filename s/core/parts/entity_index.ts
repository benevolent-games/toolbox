
import { maptool } from "@benev/slate"
import {Core} from "../core"

export class EntityIndex<CS extends Core.ComponentSchema> {
	#cache = new Map<string, Set<number>>()

	#recall(memo: string) {
		return maptool(this.#cache).guarantee(memo, () => new Set())
	}

	save(id: number, state: Partial<CS>) {
		const set = this.#recall(memoize(state))
		set.add(id)
	}
}

///////////////////////////////////
///////////////////////////////////

function memoize(state: Partial<Core.ComponentSchema>) {
	return Object
		.keys(state)
		.sort()
		.join("+")
}

