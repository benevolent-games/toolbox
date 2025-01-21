
import {Scalar} from "./scalar.js"

export type Vec2Array = [number, number]
export type Xy = {x: number, y: number}

/** https://github.com/microsoft/TypeScript/issues/5863 */
type TsHack<T> = {new(...a: ConstructorParameters<typeof Vec2>): T}

export class Vec2 implements Xy {
	constructor(
		public x: number,
		public y: number,
	) {}

	///////////////////////////////////////////////////////////////////////

	static new<T extends Vec2>(this: TsHack<T>, x: number, y: number): T {
		return new this(x, y)
	}

	static zero<T extends Vec2>(this: TsHack<T>) {
		return new this(0, 0)
	}

	static all<T extends Vec2>(this: TsHack<T>, value: number) {
		return new this(value, value)
	}

	static array<T extends Vec2>(this: TsHack<T>, v: Vec2Array) {
		return new this(...v)
	}

	static import<T extends Vec2>(this: TsHack<T>, {x, y}: Xy) {
		return new this(x, y)
	}

	static from(v: Vec2Array | Xy) {
		return Array.isArray(v)
			? this.array(v)
			: this.import(v)
	}

	static magnitudeSquared(x: number, y: number) {
		return (x * x) + (y * y)
	}

	static magnitude(x: number, y: number) {
		return Math.sqrt(this.magnitudeSquared(x, y))
	}

	static average(...vectors: Xy[]) {
		return this.zero()
			.add(...vectors)
			.divideBy(vectors.length)
	}

	static min(...vecs: Vec2[]) {
		return new Vec2(
			Math.min(...vecs.map(v => v.x)),
			Math.min(...vecs.map(v => v.y)),
		)
	}

	static max(...vecs: Vec2[]) {
		return new Vec2(
			Math.max(...vecs.map(v => v.x)),
			Math.max(...vecs.map(v => v.y)),
		)
	}

	///////////////////////////////////////////////////////////////////////

	clone() {
		return new Vec2(this.x, this.y)
	}

	array(): Vec2Array {
		return [this.x, this.y]
	}

	toString() {
		return `(Vec2 x${this.x.toFixed(2)}, y${this.y.toFixed(2)})`
	}

	/** mutator */
	set_(x: number, y: number) {
		this.x = x
		this.y = y
		return this
	}

	/** mutator */
	set({x, y}: Xy) {
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

	rotation() {
		return Math.atan2(this.y, this.x)
	}

	equals_(x: number, y: number) {
		return (
			this.x === x &&
			this.y === y
		)
	}

	equals(...vecs: Xy[]) {
		return vecs.every(({x, y}) => this.equals_(x, y))
	}

	dot_(x: number, y: number) {
		return (this.x * x) + (this.y * y)
	}

	dot({x, y}: Xy) {
		return this.dot_(x, y)
	}

	distanceSquared_(x: number, y: number) {
		x = this.x - x
		y = this.y - y
		return (x * x) + (y * y)
	}

	distanceSquared({x, y}: Xy) {
		return this.distanceSquared_(x, y)
	}

	distance_(x: number, y: number) {
		return Math.sqrt(this.distanceSquared_(x, y))
	}

	distance({x, y}: Xy) {
		return this.distance_(x, y)
	}

	angleBetween_(x: number, y: number) {
		const dot = this.dot_(x, y)
		const magnitudes = this.magnitude() * Vec2.magnitude(x, y)
		return Math.acos(dot / magnitudes)
	}

	angleBetween({x, y}: Xy) {
		return this.angleBetween_(x, y)
	}

	///////////////////////////////////////////////////////////////////////

	/** mutator */
	normalize() {
		return this.divideBy(this.magnitude())
	}

	/** mutator */
	half() {
		return this.divideBy(2)
	}

	/** mutator */
	double() {
		return this.multiplyBy(2)
	}

	/** mutator */
	abs() {
		return this.map(x => Math.abs(x))
	}

	/** mutator */
	rotate(radians: number) {
		const {x, y} = this
		this.x = (x * Math.cos(radians)) - (y * Math.sin(radians))
		this.y = (x * Math.sin(radians)) + (y * Math.cos(radians))
		return this
	}

	/** mutator */
	perpendicular() {
		const {x, y} = this
		this.x = -y
		this.y = x
		return this
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
	map(fn: (a: number, index: number) => number) {
		this.x = fn(this.x, 0)
		this.y = fn(this.y, 1)
		return this
	}

	/** mutator */
	clamp(min: number, max: number) {
		const clamp = (val: number) => Math.max(min, Math.min(max, val))
		return this.map(clamp)
	}

	/** mutator */
	negate() {
		return this.map(a => a * -1)
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

	///////////////////////////////////////////////////////////////////////

	/** mutator */
	add_(x: number, y: number) {
		this.x += x
		this.y += y
		return this
	}

	/** mutator */
	add(...vecs: Xy[]) {
		for (const {x, y} of vecs) this.add_(x, y)
		return this
	}

	/** mutator */
	subtract_(x: number, y: number) {
		this.x -= x
		this.y -= y
		return this
	}

	/** mutator */
	subtract(...vecs: Xy[]) {
		for (const {x, y} of vecs) this.subtract_(x, y)
		return this
	}

	/** mutator */
	multiply_(x: number, y: number) {
		this.x *= x
		this.y *= y
		return this
	}

	/** mutator */
	multiply(...vecs: Xy[]) {
		for (const {x, y} of vecs) this.multiply_(x, y)
		return this
	}

	/** mutator */
	divide_(x: number, y: number) {
		this.x /= x
		this.y /= y
		return this
	}

	/** mutator */
	divide(...vecs: Xy[]) {
		for (const {x, y} of vecs) this.divide_(x, y)
		return this
	}

	/** mutator */
	lerp_(x: number, y: number, fraction: number) {
		this.x += (x - this.x) * fraction
		this.y += (y - this.y) * fraction
		return this
	}

	/** mutator */
	lerp({x, y}: Xy, fraction: number) {
		return this.lerp_(x, y, fraction)
	}

	approach_(x: number, y: number, speed: number, deltaTime: number, speedLimit?: number) {
		this.x = Scalar.approach(this.x, x, speed, deltaTime, speedLimit)
		this.y = Scalar.approach(this.y, y, speed, deltaTime, speedLimit)
		return this
	}

	approach({x, y}: Xy, speed: number, deltaTime: number, speedLimit?: number) {
		return this.approach_(x, y, speed, deltaTime, speedLimit)
	}

	/** mutator */
	reflect_(x: number, y: number) {
		const dot = 2 * this.dot_(x, y)
		this.x -= dot * x
		this.y -= dot * y
		return this
	}

	/** mutator */
	reflect({x, y}: Xy) {
		return this.reflect_(x, y)
	}

	/** mutator */
	rotateAroundPoint_(x: number, y: number, radians: number) {
		const dx = this.x - x
		const dy = this.y - y
		const cos = Math.cos(radians)
		const sin = Math.sin(radians)
		this.x = cos * dx - sin * dy + x
		this.y = sin * dx + cos * dy + y
		return this
	}

	/** mutator */
	rotateAroundPoint({x, y}: Vec2, radians: number) {
		return this.rotateAroundPoint_(x, y, radians)
	}

	/** mutator */
	smooth_(x: number, y: number, smoothing: number) {
		this.x = Scalar.smooth(this.x, x, smoothing)
		this.y = Scalar.smooth(this.y, y, smoothing)
		return this
	}

	/** mutator */
	smooth({x, y}: Xy, smoothing: number) {
		return this.smooth_(x, y, smoothing)
	}
}

