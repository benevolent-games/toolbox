
import {loop} from "./loopy.js"

export type Random = () => number

export class Rand {
	static random(seed: number): Random {
		seed = 1_234 + Math.floor(seed * 1_234)
		function random() {
			seed = Math.imul(48271, seed) | 0 % 2147483647
			return (seed & 2147483647) / 2147483648
		}
		random() // discard first value
		return random
	}

	static seed(seed: number): Rand {
		return new this(this.random(seed))
	}

	constructor(
		public readonly random: Random
	) {}

	roll(chance: number) {
		return this.random() < chance
	}

	between(min: number, max: number) {
		const difference = max - min
		const value = difference * this.random()
		return min + value
	}

	index(length: number) {
		return Math.floor(this.random() * length)
	}

	choose<T>(array: T[]) {
		return array[this.index(array.length)]
	}

	select<T>(count: number, array: T[]) {
		const copy = [...array]

		if (count >= array.length)
			return copy

		const selection: T[] = []

		for (const _ of loop(count))
			selection.push(this.yoink(copy))

		return selection
	}

	yoink<T>(array: T[]) {
		const index = this.index(array.length)
		const [item] = array.splice(index, 1)
		return item
	}
}

