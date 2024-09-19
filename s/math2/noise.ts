
import {Randy, Random} from "./randy.js"
import {createNoise2D} from "simplex-noise"

export class Noise {
	static seed(seed: number) {
		const random = Randy.makeFn(seed)
		return new this(random)
	}

	#n2d: (x: number, y: number) => number

	constructor(public readonly random: Random) {
		this.#n2d = createNoise2D(random)
	}

	/** sample the noise field, returning a number from 0 to 1. */
	sample(x: number, y = 0, scale = 1) {
		const s = this.#n2d(x * scale, y * scale)
		return (s + 1) / 2
	}
}

