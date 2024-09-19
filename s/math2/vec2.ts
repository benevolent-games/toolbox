
export type Vec2Array = [number, number]
export type Xy = {x: number, y: number}

export class Vec2 implements Xy {
	constructor(
		public x: number,
		public y: number,
	) {}

	///////////////////////////////////////////////////////////////////////

	static new(x: number, y: number) {
		return new this(x, y)
	}

	static zero() {
		return new this(0, 0)
	}

	static array(v: Vec2Array) {
		return new this(...v)
	}

	static import({x, y}: Xy) {
		return new this(x, y)
	}

	static magnitudeSquared(x: number, y: number) {
		return (x * x) + (y * y)
	}

	static magnitude(x: number, y: number) {
		return Math.sqrt(this.magnitudeSquared(x, y))
	}

	///////////////////////////////////////////////////////////////////////

	clone() {
		return new Vec2(this.x, this.y)
	}

	array(): Vec2Array {
		return [this.x, this.y]
	}

	toString() {
		return `(Vec2 x${this.x.toFixed(2)}, z${this.y.toFixed(2)})`
	}

	/** mutator */
	set(x: number, y: number) {
		this.x = x
		this.y = y
		return this
	}

	/** mutator */
	setV({x, y}: Xy) {
		this.x = x
		this.y = y
		return this
	}

	///////////////////////////////////////////////////////////////////////

	magnitudeSquared() {
		return Vec2.magnitudeSquared(this.x, this.y)
	}

	magnitude() {
		return Vec2.magnitude(this.x, this.y)
	}

	equals(x: number, y: number) {
		return (
			this.x === x &&
			this.y === y
		)
	}

	equalsV(...vecs: Xy[]) {
		return vecs.every(({x, y}) => this.equals(x, y))
	}

	dot(x: number, y: number) {
		return (this.x * x) + (this.y * y)
	}

	dotV({x, y}: Xy) {
		return this.dot(x, y)
	}

	distanceSquared(x: number, y: number) {
		x = this.x - x
		y = this.y - y
		return (x * x) + (y * y)
	}

	distanceSquaredV({x, y}: Xy) {
		return this.distanceSquared(x, y)
	}

	distance(x: number, y: number) {
		return Math.sqrt(this.distanceSquared(x, y))
	}

	distanceV({x, y}: Xy) {
		return this.distance(x, y)
	}

	angleBetween(x: number, y: number) {
		const dot = this.dot(x, y)
		const magnitudes = this.magnitude() * Vec2.magnitude(x, y)
		return Math.acos(dot / magnitudes)
	}

	angleBetweenV({x, y}: Xy) {
		return this.angleBetween(x, y)
	}

	///////////////////////////////////////////////////////////////////////

	/** mutator */
	normalize() {
		return this.divideBy(this.magnitude())
	}

	/** mutator */
	rotate(radians: number) {
		const {x, y} = this
		this.x = (x * Math.cos(radians)) - (y * Math.sin(radians))
		this.y = (x * Math.sin(radians)) + (y * Math.cos(radians))
		return this
	}

	/** mutator */
	add(x: number, y: number) {
		this.x += x
		this.y += y
		return this
	}

	/** mutator */
	addV(...vecs: Xy[]) {
		for (const {x, y} of vecs) this.add(x, y)
		return this
	}

	/** mutator */
	subtract(x: number, y: number) {
		this.x -= x
		this.y -= y
		return this
	}

	/** mutator */
	subtractV(...vecs: Xy[]) {
		for (const {x, y} of vecs) this.subtract(x, y)
		return this
	}

	/** mutator */
	multiply(x: number, y: number) {
		this.x *= x
		this.y *= y
		return this
	}

	/** mutator */
	multiplyV(...vecs: Xy[]) {
		for (const {x, y} of vecs) this.multiply(x, y)
		return this
	}

	/** mutator */
	lerp(x: number, y: number, fraction: number) {
		this.x += (x - this.x) * fraction
		this.y += (y - this.y) * fraction
		return this
	}

	/** mutator */
	lerpV({x, y}: Xy, fraction: number) {
		return this.lerp(x, y, fraction)
	}

	/** mutator */
	perpendicular() {
		const {x, y} = this
		this.x = -y
		this.y = x
		return this
	}

	/** mutator */
	reflect(x: number, y: number) {
		const dot = 2 * this.dot(x, y)
		this.x -= dot * x
		this.y -= dot * y
		return this
	}

	/** mutator */
	reflectV({x, y}: Xy) {
		return this.reflect(x, y)
	}

	/** mutator */
	clampMagnitude(max: number) {
		const mag = this.magnitude()
		if (mag > max)
			this.normalize().multiplyBy(max)
		return this
	}

	/** mutator */
	floor() {
		this.x = Math.floor(this.x)
		this.y = Math.floor(this.y)
		return this
	}

	/** mutator */
	ceil() {
		this.x = Math.ceil(this.x)
		this.y = Math.ceil(this.y)
		return this
	}

	/** mutator */
	round() {
		this.x = Math.round(this.x)
		this.y = Math.round(this.y)
		return this
	}

	/** mutator */
	rotateAroundPoint(x: number, y: number, radians: number) {
		const dx = this.x - x
		const dy = this.y - y
		const cos = Math.cos(radians)
		const sin = Math.sin(radians)
		this.x = cos * dx - sin * dy + x
		this.y = sin * dx + cos * dy + y
		return this
	}

	/** mutator */
	each(fn: (a: number) => number) {
		this.x = fn(this.x)
		this.y = fn(this.y)
		return this
	}

	/** mutator */
	clamp(min: number, max: number) {
		const clamp = (val: number) => Math.max(min, Math.min(max, val))
		return this.each(clamp)
	}

	/** mutator */
	negate() {
		return this.each(a => a * -1)
	}

	/** mutator */
	addBy(delta: number) {
		this.x += delta
		this.y += delta
		return this
	}

	/** mutator */
	subtractBy(delta: number) {
		this.x -= delta
		this.y -= delta
		return this
	}

	/** mutator */
	multiplyBy(coefficient: number) {
		this.x *= coefficient
		this.y *= coefficient
		return this
	}

	/** mutator */
	divideBy(divisor: number) {
		if (divisor === 0) return this
		this.x /= divisor
		this.y /= divisor
		return this
	}
}

