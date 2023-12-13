
import {Constrained} from "../utils/constrained.js"
import {Vec2} from "../../../../../tools/math/vec2.js"
import {scalar} from "../../../../../tools/math/scalar.js"

export type GimbalParams = {
	sensitivity: number
}

export class Gimbal {
	#params: GimbalParams

	#vertical = {
		spine: new Constrained(0.5, x => scalar.cap(x)),
	}

	#horizontal = {
		capsule: new Constrained(0, x => scalar.wrap(x)),
		swivel: new Constrained(0.5, x => scalar.cap(x)),
	}

	constructor(params: {sensitivity: number}) {
		this.#params = params
	}

	get spine() { return this.#vertical.spine.value }
	set spine(x: number) { this.#vertical.spine.value = x }

	get capsule() { return this.#horizontal.capsule.value }
	set capsule(x: number) { this.#horizontal.capsule.value = x }

	get swivel() { return this.#horizontal.swivel.value }
	set swivel(x: number) { this.#horizontal.swivel.value = x }

	update([x, y]: Vec2) {
		const {sensitivity: s} = this.#params
		this.capsule += x * s
		this.swivel += x * s * 2
		this.spine += y * s
	}
}

