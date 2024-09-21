
export class Scalar {
	constructor(public x: number) {}

	static new(x: number) {
		return new this(x)
	}

	clone() {
		return new Scalar(this.x)
	}

	//
	// queries
	//

	static isBetween(x: number, a: number = 0, b: number = 1) {
		const min = Math.min(a, b)
		const max = Math.max(a, b)
		return (x >= min) && (x <= max)
	} isBetween(a: number = 0, b: number = 1) {
		return Scalar.isBetween(this.x, a, b)
	}

	static isNear(x: number, y: number, epsilon: number = 0.01) {
		return Math.abs(x - y) <= epsilon
	} isNear(y: number, epsilon: number = 0.01) {
		return Scalar.isNear(this.x, y, epsilon)
	}

	//
	// chainable transforms
	//

	static min(x: number, minimum: number = 0) {
		return Math.max(x, minimum)
	} min(minimum: number) {
		this.x = Scalar.min(this.x, minimum)
		return this
	}

	static max(x: number, maximum: number = 1) {
		return Math.min(x, maximum)
	} max(maximum: number) {
		this.x = Scalar.max(this.x, maximum)
		return this
	}

	static clamp(x: number, a: number = 0, b: number = 1) {
		x = Scalar.min(x, Math.min(a, b))
		x = Scalar.max(x, Math.max(a, b))
		return x
	} clamp(a: number, b: number) {
		this.x = Scalar.clamp(this.x, a, b)
		return this
	}

	static lerp(x: number, y: number, fraction: number) {
		const difference = y - x
		const value = difference * fraction
		return x + value
	} lerp(y: number, fraction: number) {
		this.x = Scalar.lerp(this.x, y, fraction)
		return this
	}

	static wrap(x: number, a: number = 0, b: number = 1) {
		const min = Math.min(a, b)
		const max = Math.max(a, b)
		const span = max - min
		const adjusted = x - min
		const wrapped = (adjusted < 0)
			? span - (-adjusted % span)
			: adjusted % span
		return min + wrapped
	} wrap(a: number = 0, b: number = 1) {
		this.x = Scalar.wrap(this.x, a, b)
		return this
	}

	static constrainProximity(x: number, y: number, range: number) {
		const trueDiff = y - x
		const positiveDiff = Math.abs(trueDiff)
		const cappedDiff = (positiveDiff > range)
			? range
			: positiveDiff
		const newDiff = (trueDiff < 0) ? -cappedDiff : cappedDiff
		return x + newDiff
	} constrainProximity(y: number, range: number) {
		this.x = Scalar.constrainProximity(this.x, y, range)
		return this
	}

	static inverse(x: number) {
		return 1 - x
	} inverse() {
		this.x = Scalar.inverse(this.x)
		return this
	}

	static center(x: number) {
		return (x * 2) - 1
	} center() {
		this.x = Scalar.center(this.x)
		return this
	}

	static uncenter(x: number) {
		return (x + 1) / 2
	} uncenter() {
		this.x = Scalar.uncenter(this.x)
		return this
	}

	static map(x: number, a: number, b: number) {
		const difference = b - a
		const value = difference * x
		return a + value
	} map(a: number, b: number) {
		this.x = Scalar.map(this.x, a, b)
		return this
	}

	static remap(x: number, a1: number, a2: number, b1: number = 0, b2: number = 1) {
		const fraction = (x - a1) / (a2 - a1)
		return (fraction * (b2 - b1)) + b1
	} remap(a1: number, a2: number, b1: number = 0, b2: number = 1) {
		this.x = Scalar.remap(this.x, a1, a2, b1, b2)
		return this
	}

	static magnify(x: number) {
		return 4 * Math.pow(x - 0.5, 3) + 0.5
	} magnify() {
		this.x = Scalar.magnify(this.x)
		return this
	}

	static floor(x: number) {
		return Math.floor(x)
	} floor() {
		this.x = Scalar.floor(this.x)
		return this
	}

	static ceil(x: number) {
		return Math.ceil(x)
	} ceil() {
		this.x = Scalar.ceil(this.x)
		return this
	}

	static round(x: number) {
		return Math.round(x)
	} round() {
		this.x = Scalar.round(this.x)
		return this
	}

	static smooth(x: number, y: number, smoothing: number) {
		return smoothing <= 1
			? y
			: x + ((y - x) / smoothing)
	} smooth(y: number, smoothing: number) {
		this.x = Scalar.smooth(this.x, y, smoothing)
		return this
	}
}

