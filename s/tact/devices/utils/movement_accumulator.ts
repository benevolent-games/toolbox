
import {Vec2, add, zero} from "../../../math/vec2.js"

export class MovementAccumulator {
	#movement = zero()
	#dispose: () => void

	constructor(dispose: () => void) {
		this.#dispose = dispose
	}

	add(move: Vec2) {
		this.#movement = add(this.#movement, move)
	}

	steal() {
		const movement = this.#movement
		this.#movement = zero()
		return movement
	}

	dispose() {
		this.#dispose()
	}
}

