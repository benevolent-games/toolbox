
export type Random = () => number

/** utility for generating and using random numbers. */
export class Randy {
	constructor(public readonly random: Random = Randy.makeFn(1)) {}

	/** make a pseudo-random number generator function that produces numbers between 0 and 1. */
	static makeFn(seed: number): Random {
		seed = 123456789 + Math.floor(seed * 123456789)
		function random() {
			seed = Math.imul(48271, seed) | 0 % 2147483647
			return (seed & 2147483647) / 2147483648
		}
		random() // discard first value
		return random
	}

	/** create a Rand instance with the given seed number. */
	static seed(seed: number): Randy {
		return new this(this.makeFn(seed))
	}

	/** return true or false, given a 0 to 1 probability fraction. */
	roll(chance: number) {
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

	/** @deprecated renamed to `take` */
	extract<T>(count: number, array: T[]) { return this.take(count, array) }

	/** @deprecated renamed to `range` */
	between(a: number, b: number) { return this.range(a, b) }

	/** @deprecated renamed to `integerRange` */
	integerBetween(a: number, b: number) { return this.integerRange(a, b) }
}

