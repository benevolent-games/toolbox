
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

export class Radians {
	static pi = pi
	static circle = circle
	static to = to
	static from = from
}

