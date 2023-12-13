
import {Molasses} from "../utils/molasses.js"
import {scalar} from "../../../../../tools/math/scalar.js"
import {Vec2, vec2} from "../../../../../tools/math/vec2.js"

export class Strider {
	#vector: Molasses

	constructor({speed}: {speed: number}) {
		this.#vector = new Molasses(speed)
	}

	get vector() { return this.#vector.vector }
	get x() { return this.vector[0] }
	get y() { return this.vector[1] }

	get magnitude() { return vec2.magnitude(this.vector) }
	get stillness() { return scalar.cap(1 - this.magnitude, 0, 1) }

	get north() { return scalar.cap(this.y, 0, 1) }
	get west() { return -scalar.cap(this.x, -1, 0) }
	get south() { return -scalar.cap(this.y, -1, 0) }
	get east() { return scalar.cap(this.x, 0, 1) }

	update(target: Vec2) {
		this.#vector.update(target)
	}
}

