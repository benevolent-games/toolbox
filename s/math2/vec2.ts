
export type Vec2Array = [number, number]
export type Xy = {x: number, y: number}

export class Vec2 implements Xy {
	constructor(
		public x = 0,
		public y = 0,
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

	static equal(...vecs: Xy[]) {
		const [vec] = vecs
		if (!vec)
			return true
		return vecs.every(({x, y}) => x === vec.x && y === vec.y)
	}

	///////////////////////////////////////////////////////////////////////

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

	setV({x, y}: Xy) {
		this.x = x
		this.y = y
		return this
	}

	///////////////////////////////////////////////////////////////////////

	magnitudeSquared() {
		const {x, y} = this
		return (x * x) + (y * y)
	}

	magnitude() {
		return Math.sqrt(this.magnitudeSquared())
	}

	///////////////////////////////////////////////////////////////////////

	equals(x: number, y: number) {
		return (
			this.x === x &&
			this.y === y
		)
	}

	equalsV(a: Xy, ...b: Xy[]) {
		return [a, ...b].every(({x, y}) => this.equals(x, y))
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
		const magnitudes = this.magnitude() * Vec2.new(x, y).magnitude()
		return Math.acos(dot / magnitudes)
	}

	angleBetweenV({x, y}: Xy) {
		return this.angleBetween(x, y)
	}

	///////////////////////////////////////////////////////////////////////

	/** mutator */
	normalize() {
		const length = this.magnitude()
		if (length !== 0) {
			this.x /= length
			this.y /= length
		}
		return this
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
	leash(max: number) {
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
	each(change: (a: number) => number) {
		this.x = change(this.x)
		this.y = change(this.y)
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
	multiplyBy(factor: number) {
		return this.each(a => a * factor)
	}

	/** mutator */
	divideBy(factor: number) {
		return this.each(a => a / factor)
	}

	/** mutator */
	addBy(amount: number) {
		return this.each(a => a + amount)
	}
}

