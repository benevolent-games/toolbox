
export type Random = () => number

export interface Randomly {
	random: Random
	select<T>(items: T[]): T | undefined
	flip(probability: number): boolean
	between(min: number, max: number): number
}

export function seed(s: number = Math.random()): () => number {
	s = 999_999 + Math.floor(s * 999_999)

	return () => {
		s = Math.imul(48271, s) | 0 % 2147483647
		return (s & 2147483647) / 2147483648
	}
}

export function r(random: () => number): Randomly {
	return {
		random,

		select(items) {
			if (!items.length)
				return undefined
			const index = Math.floor(random() * items.length)
			return items[index]
		},

		flip(probability) {
			return random() < probability
		},

		between(min, max) {
			const range = max - min
			const amount = random() * range
			return min + amount
		},
	}
}
