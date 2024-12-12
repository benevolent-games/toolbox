
import {Scalar} from "./scalar.js"

const pi = Math.PI
const circle = 2 * Math.PI

const to = {
	degrees(r: number) {
		return r * (180 / pi)
	},
	arcseconds(r: number) {
		return to.degrees(r) * 3600
	},
	turns(r: number) {
		return r / circle
	},
}

const from = {
	turns(t: number) {
		return t * circle
	},
	degrees(d: number) {
		return d * (pi / 180)
	},
	arcseconds(a: number) {
		return from.degrees(a / 3600)
	}
}

export const Radians = {
	pi,
	circle,

	/** @deprecated use Radians.toDegrees instead */
	to,

	/** @deprecated use Degrees.toRadians instead */
	from,

	toDegrees(r: number) {
		return r * (180 / pi)
	},
	toArcseconds(r: number) {
		return to.degrees(r) * 3600
	},
	toTurns(r: number) {
		return r / circle
	},

	circleDistance(radiansA: number, radiansB: number): number {
		const diff = Math.abs(Scalar.wrap(radiansA - radiansB, 0, Radians.circle))
		return Math.min(diff, Radians.circle - diff)
	},
}

export const Turns = {
	toRadians(t: number) {
		return t * circle
	},
}

export const Arcseconds = {
	toRadians(a: number) {
		return from.degrees(a / 3600)
	},
}

export const Degrees = {
	toRadians(d: number) {
		return d * (pi / 180)
	},
}

