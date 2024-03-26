
import {Selector} from "./types.js"

export function selectors_are_the_same(alpha: Selector, bravo: Selector) {
	const a = Object.values(alpha)
	const b = Object.values(bravo)
	return a.length === b.length
		? a.every(C => b.includes(C))
		: false
}

