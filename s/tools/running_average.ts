
export class RunningAverage {
	#limit: number
	#values: number[] = []
	#average: number = 0

	constructor(limit = 10) {
		this.#limit = limit
	}

	#trim_to_limit() {
		while (this.#values.length > this.#limit)
			this.#values.shift()
	}

	#compute_average() {
		const sum = this.#values.reduce((p, c) => p + c, 0)
		this.#average = sum / this.#values.length
	}

	add(value: number) {
		this.#values.push(value)
		this.#trim_to_limit()
		this.#compute_average()
	}

	get average() {
		return this.#average
	}
}

