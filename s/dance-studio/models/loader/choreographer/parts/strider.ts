
import {Molasses} from "../utils/molasses.js"
import {scalar} from "../../../../../tools/math/scalar.js"
import {Vec2, vec2} from "../../../../../tools/math/vec2.js"

export class Strider {
	#vector: Molasses

	constructor({speed}: {speed: number}) {
		this.#vector = new Molasses(speed)
	}

	update(target: Vec2) {
		const vector = this.#vector.update(target)
		const magnitude = vec2.magnitude(vector)
		const stillness = scalar.cap(1 - magnitude, 0, 1)
		const [x, y] = vector
		const north = scalar.cap(y, 0, 1)
		const west = -scalar.cap(x, -1, 0)
		const south = -scalar.cap(y, -1, 0)
		const east = scalar.cap(x, 0, 1)
		return {magnitude, stillness, north, west, south, east}
	}
}

