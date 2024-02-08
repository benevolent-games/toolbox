
import {Rand, Random} from "../rand.js"
import {createNoise2D} from "simplex-noise/dist/esm/simplex-noise.js"

export class Noise {
	static seed(seed: number) {
		return new this(Rand.random(seed))
	}

	#n2d: (x: number, y: number) => number

	constructor(public readonly random: Random) {
		this.#n2d = createNoise2D(random)
	}

	sample(x: number, y: number, scale = 1) {
		return this.#n2d(x * scale, y * scale)
	}
}

