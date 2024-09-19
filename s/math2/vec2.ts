
export type Vec2Array = [number, number]
export type Xy = {x: number, y: number}

export class Vec2 {
	constructor(
		public x = 0,
		public y = 0,
	) {}

	//
	// statics
	//

	static new(x: number, y: number) {
		return new this(x, y)
	}

	static zero() {
		return new this(0, 0)
	}

	static import({x, y}: Xy) {
		return new this(x, y)
	}

	//
	// fundamentals
	//

	clone() {
		return new Vec2(this.x, this.y)
	}

	array(): Vec2Array {
		return [this.x, this.y]
	}

	set(x: number, y: number) {
		this.x = x
		this.y = y
		return this
	}

	//
	// queries
	//

	equal(a: Vec2, ...b: Vec2[]) {
		const {x, y} = this
		for (const {x: x2, y: y2} of [a, ...b]) {
			if (x !== x2 || y !== y2)
				return false
		}
		return true
	}

	dot(b: Vec2): number {
		return (this.x * b.x) + (this.y * b.y)
	}

	distance(b: Vec2): number {
		const x = this.x - b.x
		const y = this.y - b.y
		return Math.sqrt((x * x) + (y * y))
	}

	atan2(b: Vec2): number {
		return Math.atan2(b.y, b.x) - Math.atan2(this.y, this.x)
	}

	magnitude(): number {
		return Math.sqrt(this.x * this.x + this.y * this.y)
	}

	distanceSquared(b: Vec2): number {
		const dx = this.x - b.x
		const dy = this.y - b.y
		return dx * dx + dy * dy
	}

	//
	// chainable transforms
	//

	rotate(radians: number) {
		const {x, y} = this
		this.x = (x * Math.cos(radians)) - (y * Math.sin(radians))
		this.y = (x * Math.sin(radians)) + (y * Math.cos(radians))
		return this
	}

	add(...vectors: Vec2[]) {
		for (const vector of vectors) {
			this.x += vector.x
			this.y += vector.y
		}
		return this
	}

	subtract(b: Vec2) {
		this.x -= b.x
		this.y -= b.y
		return this
	}

	multiply(b: Vec2) {
		this.x *= b.x
		this.y *= b.y
		return this
	}

	normalize() {
		const length = this.magnitude()
		if (length !== 0) {
			this.x /= length
			this.y /= length
		}
		return this
	}

	lerp(target: Vec2, fraction: number) {
		this.x += (target.x - this.x) * fraction
		this.y += (target.y - this.y) * fraction
		return this
	}

	perpendicular() {
		const {x, y} = this
		this.x = -y
		this.y = x
		return this
	}

	reflect(normal: Vec2): this {
		const dotProduct = 2 * this.dot(normal)
		this.x -= dotProduct * normal.x
		this.y -= dotProduct * normal.y
		return this
	}

	angleBetween(b: Vec2): number {
		const dotProduct = this.dot(b)
		const magnitudes = this.magnitude() * b.magnitude()
		return Math.acos(dotProduct / magnitudes)
	}

	clampMagnitude(max: number): this {
		const mag = this.magnitude()
		if (mag > max) {
			this.normalize().multiplyBy(max)
		}
		return this
	}

	floor(): this {
		this.x = Math.floor(this.x)
		this.y = Math.floor(this.y)
		return this
	}

	ceil(): this {
		this.x = Math.ceil(this.x)
		this.y = Math.ceil(this.y)
		return this
	}

	round(): this {
		this.x = Math.round(this.x)
		this.y = Math.round(this.y)
		return this
	}

	rotateAroundPoint(point: Vec2, radians: number): this {
		const dx = this.x - point.x
		const dy = this.y - point.y
		const cos = Math.cos(radians)
		const sin = Math.sin(radians)
		this.x = cos * dx - sin * dy + point.x
		this.y = sin * dx + cos * dy + point.y
		return this
	}

	applyBy(change: (a: number) => number) {
		this.x = change(this.x)
		this.y = change(this.y)
		return this
	}

	clamp(min: number, max: number) {
		const clamp = (val: number) => Math.max(min, Math.min(max, val))
		return this.applyBy(clamp)
	}

	negate() {
		return this.applyBy(a => a * -1)
	}

	multiplyBy(factor: number) {
		return this.applyBy(a => a * factor)
	}

	divideBy(factor: number) {
		return this.applyBy(a => a / factor)
	}

	addBy(amount: number) {
		return this.applyBy(a => a + amount)
	}
}

