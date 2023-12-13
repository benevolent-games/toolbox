
import {scalar} from "../../../../../tools/math/scalar.js"
import {Vec2, vec2} from "../../../../../tools/math/vec2.js"

export class Molasses {
	#delta: number
	#current: Vec2 = [0, 0]

	constructor(delta: number) {
		this.#delta = delta
	}

	get vector() {
		return this.#current
	}

	update(target: Vec2) {
		const [x, y] = vec2.subtract(target, this.#current)
		this.#current = vec2.add(this.#current, [
			this.#cap_scalar_to_delta_positive_or_negative(x),
			this.#cap_scalar_to_delta_positive_or_negative(y),
		])
		return this.#current
	}

	#cap_scalar_to_delta_positive_or_negative(n: number) {
		const delta = this.#delta
		return scalar.within(n, -delta, delta)
			? n
			: n < 0
				? -delta
				: delta
	}
}

