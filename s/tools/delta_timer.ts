
import {clamp} from "../math/scalar.js"

export class DeltaTimer {
	#ms: number
	#oldtimer = performance.now()

	#biggest: number
	#smallest: number

	constructor(o: {
			min_hertz: number
			max_hertz: number
		}) {
		this.#biggest = 1000 / o.min_hertz
		this.#smallest = 1000 / o.max_hertz
		this.#ms = o.max_hertz
	}

	get ms() {
		return this.#ms
	}

	measure() {
		const ms = performance.now() - this.#oldtimer
		this.#oldtimer = performance.now()
		this.#ms = clamp(ms, this.#smallest, this.#biggest)
		return this.#ms
	}
}

