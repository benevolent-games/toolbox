
import {Constrained} from "../utils/constrained.js"
import {Vec2} from "../../../../../tools/math/vec2.js"
import {scalar} from "../../../../../tools/math/scalar.js"

export class Gimbal {
	#sensitivity: number

	#vertical = {
		spine: new Constrained(0.5, x => scalar.cap(x)),
	}

	#horizontal = {
		capsule: new Constrained(0, x => scalar.wrap(x)),
		swivel: new Constrained(0.5, x => scalar.cap(x)),
	}

	constructor({sensitivity}: {sensitivity: number}) {
		this.#sensitivity = sensitivity
	}

	update([x, y]: Vec2) {
		const s = this.#sensitivity
		this.#horizontal.capsule.value += x * s
		this.#horizontal.swivel.value += x * s * 2
		this.#vertical.spine.value += y * s
		return {
			spine: this.#vertical.spine.value,
			capsule: this.#horizontal.capsule.value,
			swivel: this.#horizontal.swivel.value,
		}
	}
}

