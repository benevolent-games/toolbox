
export class Counter {
	#count = 0

	get count() {
		return this.#count++
	}
}

