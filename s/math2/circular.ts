
import {Scalar} from "./scalar.js"

export class Circular {
	constructor(public x: number) {}

	clone() {
		return new Circular(this.x)
	}

	set(x: number) {
		this.x = x
		return this
	}

	static value(x: number | Circular) {
		return typeof x === "number"
			? x
			: x.x
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
	} difference(y: number | Circular) {
		return Circular.difference(this.x, Circular.value(y))
	}

	static lerp(x: number, y: number, fraction: number, max?: number) {
		const difference = this.difference(x, y)
		let delta = difference * fraction
		if (max !== undefined && Math.abs(delta) > max)
			delta = Math.sign(delta) * max
		return this.normalize(x + delta)
	} lerp(y: number | Circular, fraction: number, max?: number) {
		this.x = Circular.lerp(this.x, Circular.value(y), fraction, max)
		return this
	}

	static step(x: number, y: number, delta: number) {
		const difference = this.difference(x, y)
		return this.normalize(
			Math.abs(difference) <= delta
				? y
				: x + (Math.sign(difference) * delta)
		)
	} step(y: number | Circular, delta: number) {
		this.x = Circular.step(this.x, Circular.value(y), delta)
		return this
	}

	static approach(x: number, y: number, speed: number, deltaTime: number, speedLimit?: number) {
		const difference = this.difference(x, y)
		const change = Scalar.creep(difference, speed, deltaTime, speedLimit)
		return this.normalize(x + change)
	} approach(y: number | Circular, speed: number, deltaTime: number, speedLimit?: number) {
		this.x = Circular.approach(this.x, Circular.value(y), speed, deltaTime, speedLimit)
		return this
	}
}

