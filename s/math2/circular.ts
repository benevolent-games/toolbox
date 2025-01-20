
import {Scalar} from "./scalar.js"

export class Circular {
	constructor(public x: number) {}

	clone() {
		return new Circular(this.x)
	}

	static normalize(x: number) {
		return Scalar.wrap(x, 0, 2 * Math.PI)
	} normalize() {
		this.x = Circular.normalize(this.x)
		return this
	}

	static difference(x: number, y: number) {
		x = this.normalize(x)
		y = this.normalize(y)
		let delta = y - x
		if (delta > Math.PI) delta -= 2 * Math.PI
		if (delta < -Math.PI) delta += 2 * Math.PI
		return delta
	} distance(y: number) {
		return Circular.difference(this.x, y)
	}

	static lerp(x: number, y: number, fraction: number, max?: number) {
		const difference = this.difference(x, y)
		let delta = difference * fraction
		if (max !== undefined && Math.abs(delta) > max)
			delta = Math.sign(delta) * max
		return this.normalize(x + delta)
	} lerp(y: number, fraction: number, max?: number) {
		this.x = Circular.lerp(this.x, y, fraction, max)
		return this
	}

	static step(x: number, y: number, delta: number) {
		const difference = this.difference(x, y)
		return this.normalize(
			Math.abs(difference) <= delta
				? y
				: x + (Math.sign(difference) * delta)
		)
	} step(y: number, delta: number) {
		this.x = Circular.step(this.x, y, delta)
		return this
	}
}

