
import {Scalar} from "./scalar.js"

export class Circular {
	constructor(public x: number) {}

	static normalize(x: number) {
		return Scalar.wrap(x, 0, 2 * Math.PI)
	} normalize(x: number) {
		return Circular.normalize(x)
	}

	static distance(x: number, y: number) {
		x = this.normalize(x)
		y = this.normalize(y)
		let delta = y - x
		if (delta > Math.PI) delta -= 2 * Math.PI
		if (delta < -Math.PI) delta += 2 * Math.PI
		return delta
	} distance(x: number, y: number) {
		return Circular.distance(x, y)
	}

	static lerp(x: number, y: number, fraction: number) {
		const delta = this.distance(x, y)
		return this.normalize(x + (delta * fraction))
	} lerp(x: number, y: number, fraction: number) {
		return Circular.lerp(x, y, fraction)
	}

	static step(x: number, y: number, delta: number) {
		const difference = this.distance(x, y)
		return this.normalize(
			Math.abs(difference) <= delta
				? y
				: x + (Math.sign(difference) * delta)
		)
	} step(x: number, y: number, delta: number) {
		return Circular.step(x, y, delta)
	}
}
