
export type Random = () => number

/** utility for generating and using random numbers. */
export class Randy {
	random: Random

	constructor(public readonly seed: number = Randy.randomSeed()) {
		this.random = Randy.makeRandom(seed)
	}

	/** obtain a random positive 32 bit integer. */
	static randomSeed() {
		return Math.floor(Math.random() * 2147483647)
	}

	/** seed a pseudo-random number generator function that produces numbers between 0 and 1. */
	static makeRandom(seed: number): Random {
		seed = (seed ^ 0x6D2B79F5) + 0x1E35A7BD
		seed = (Math.abs(seed | 0) % 2147483647) || 1

		function random() {
			seed = (Math.imul(48271, seed) | 0) % 2147483647
			return (seed & 2147483647) / 2147483648
		}

		random() // discard first value
		return random
	}

	/** obtain a random positive integer. */
	integer() {
		return Math.floor(this.random() * 2147483647)
	}

	/** return true or false, given a 0 to 1 probability fraction. */
	roll(chance = 0.5) {
		return this.random() <= chance
	}

	/** generate a random number between two numbers. */
	range(a: number, b: number) {
		const difference = b - a
		const value = difference * this.random()
		return a + value
	}

	/** generate a random integer between two numbers (inclusive). */
	integerRange(a: number, b: number) {
		return Math.round(this.range(a, b))
	}

	/** randomly choose an index given an array length. */
	index(length: number) {
		return Math.floor(this.random() * length)
	}

	/** return a random item from the given array. */
	choose<T>(array: T[]) {
		return array[this.index(array.length)]
	}

	/** remove and return a random item from the given array. */
	yoink<T>(array: T[]) {
		const index = this.index(array.length)
		const [item] = array.splice(index, 1)
		return item
	}

	/** randomly select a number of array items. */
	select<T>(count: number, array: T[]) {
		const copy = [...array]
		if (count >= array.length)
			return copy

		const selection: T[] = []
		for (let i = 0; i < count; i++)
			selection.push(this.yoink(copy))
		return selection
	}

	/** remove and return a number of items from the given array. */
	take<T>(count: number, array: T[]) {
		const selection: T[] = []
		for (let i = 0; i < count; i++) {
			if (array.length === 0)
				return selection
			selection.push(this.yoink(array))
		}
		return selection
	}

	/** shuffle an array in-place using (fisher-yates) */
	shuffle<T>(array: T[]) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(this.random() * (i + 1))
			;[array[i], array[j]] = [array[j], array[i]]
		}
		return array
	}

	/** @deprecated create an instance with the given seed number. */
	static seed(seed: number): Randy {
		return new this(seed)
	}

	/** @deprecated renamed to `take` */
	extract<T>(count: number, array: T[]) { return this.take(count, array) }

	/** @deprecated renamed to `range` */
	between(a: number, b: number) { return this.range(a, b) }

	/** @deprecated renamed to `integerRange` */
	integerBetween(a: number, b: number) { return this.integerRange(a, b) }
}

