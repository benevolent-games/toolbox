
import {Scalar} from "./scalar.js"

export type Vec3Array = [number, number, number]
export type Xyz = {x: number, y: number, z: number}

/** https://github.com/microsoft/TypeScript/issues/5863 */
type TsHack<T> = {new(...a: ConstructorParameters<typeof Vec3>): T}

export class Vec3 {
	constructor(
		public x: number,
		public y: number,
		public z: number,
	) {}

	///////////////////////////////////////////////////////////////////////

	static new<T extends Vec3>(this: TsHack<T>, x: number, y: number, z: number) {
		return new this(x, y, z)
	}

	static zero<T extends Vec3>(this: TsHack<T>) {
		return new this(0, 0, 0)
	}

	static all<T extends Vec3>(this: TsHack<T>, value: number) {
		return new this(value, value, value)
	}

	static array<T extends Vec3>(this: TsHack<T>, v: Vec3Array) {
		return new this(...v)
	}

	static import<T extends Vec3>(this: TsHack<T>, {x, y, z}: Xyz): Vec3 {
		return new this(x, y, z)
	}

	static from(v: Vec3Array | Xyz) {
		return Array.isArray(v)
			? this.array(v)
			: this.import(v)
	}

	static magnitudeSquared(x: number, y: number, z: number) {
		return (x ** 2) + (y ** 2) + (z ** 2)
	}

	static magnitude(x: number, y: number, z: number) {
		return Math.sqrt(this.magnitudeSquared(x, y, z))
	}

	static average(...vecs: Xyz[]) {
		return this.zero()
			.add(...vecs)
			.divideBy(vecs.length)
	}

	static min(...vecs: Vec3[]) {
		return new Vec3(
			Math.min(...vecs.map(v => v.x)),
			Math.min(...vecs.map(v => v.y)),
			Math.min(...vecs.map(v => v.z)),
		)
	}

	static max(...vecs: Vec3[]) {
		return new Vec3(
			Math.max(...vecs.map(v => v.x)),
			Math.max(...vecs.map(v => v.y)),
			Math.max(...vecs.map(v => v.z)),
		)
	}

	static hexColor(hex: string): Vec3 {
		if (hex.startsWith("#") && hex.length === 7) {
			const r = parseInt(hex.slice(1, 3), 16) / 255
			const g = parseInt(hex.slice(3, 5), 16) / 255
			const b = parseInt(hex.slice(5, 7), 16) / 255
			return new this(r, g, b)
		} else {
			throw new Error("invalid hex color format")
		}
	}

	///////////////////////////////////////////////////////////////////////

	clone() {
		return new Vec3(this.x, this.y, this.z)
	}

	array(): Vec3Array {
		return [this.x, this.y, this.z]
	}

	toString() {
		return `(Vec3 x${this.x.toFixed(2)}, y${this.y.toFixed(2)}, z${this.z.toFixed(2)})`
	}

	set_(x: number, y: number, z: number) {
		this.x = x
		this.y = y
		this.z = z
		return this
	}

	set({x, y, z}: Xyz) {
		this.x = x
		this.y = y
		this.z = z
		return this
	}

	///////////////////////////////////////////////////////////////////////

	magnitudeSquared() {
		return Vec3.magnitudeSquared(this.x, this.y, this.z)
	}

	magnitude() {
		return Vec3.magnitude(this.x, this.y, this.z)
	}

	hexColor() {
		const to255 = (val: number) => Math.round(val * 255)
		const toHex = (val: number) => to255(val).toString(16).padStart(2, '0')
		return `#${toHex(this.x)}${toHex(this.y)}${toHex(this.z)}`
	}

	///////////////////////////////////////////////////////////////////////

	equals_(x: number, y: number, z: number) {
		return (
			this.x === x &&
			this.y === y &&
			this.z === z
		)
	}

	equals(...vecs: Xyz[]) {
		return vecs.every(v => this.equals_(v.x, v.y, v.z))
	}

	distanceSquared_(x: number, y: number, z: number) {
		const dx = this.x - x
		const dy = this.y - y
		const dz = this.z - z
		return (dx ** 2) + (dy ** 2) + (dz ** 2)
	}

	distanceSquared({x, y, z}: Xyz) {
		return this.distanceSquared_(x, y, z)
	}

	distance_(x: number, y: number, z: number) {
		return Math.sqrt(this.distanceSquared_(x, y, z))
	}

	distance({x, y, z}: Xyz) {
		return this.distance_(x, y, z)
	}

	dot_(x: number, y: number, z: number) {
		return (this.x * x) + (this.y * y) + (this.z * z)
	}

	dot({x, y, z}: Xyz) {
		return this.dot_(x, y, z)
	}

	inRange_(x: number, y: number, z: number, radius: number) {
		const d2 = this.distanceSquared_(x, y, z)
		return d2 < (radius ** 2)
	}

	inRange({x, y, z}: Xyz, radius: number) {
		return this.inRange_(x, y, z, radius)
	}

	angleBetween_(x: number, y: number, z: number) {
		const dotProduct = this.dot_(x, y, z)
		const magnitudes = this.magnitude() * Vec3.new(x, y, z).magnitude()
		return Math.acos(dotProduct / magnitudes)
	}

	angleBetween({x, y, z}: Xyz) {
		return this.angleBetween_(x, y, z)
	}

	///////////////////////////////////////////////////////////////////////

	/** mutator */
	add_(x: number, y: number, z: number) {
		this.x += x
		this.y += y
		this.z += z
		return this
	}

	/** mutator */
	add(...vecs: Xyz[]) {
		for (const {x, y, z} of vecs) this.add_(x, y, z)
		return this
	}

	/** mutator */
	subtract_(x: number, y: number, z: number) {
		this.x -= x
		this.y -= y
		this.z -= z
		return this
	}

	/** mutator */
	subtract(...vecs: Xyz[]) {
		for (const {x, y, z} of vecs) this.subtract_(x, y, z)
		return this
	}

	/** mutator */
	multiply_(x: number, y: number, z: number) {
		this.x *= x
		this.y *= y
		this.z *= z
		return this
	}

	/** mutator */
	multiply(...vecs: Vec3[]) {
		for (const {x, y, z} of vecs) this.multiply_(x, y, z)
		return this
	}

	/** mutator */
	divide_(x: number, y: number, z: number) {
		this.x /= x
		this.y /= y
		this.z /= z
		return this
	}

	/** mutator */
	divide(...vecs: Vec3[]) {
		for (const {x, y, z} of vecs) this.divide_(x, y, z)
		return this
	}

	///////////////////////////////////////////////////////////////////////

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
	map(fn: (a: number, index: number) => number) {
		this.x = fn(this.x, 0)
		this.y = fn(this.y, 1)
		this.z = fn(this.z, 2)
		return this
	}

	/** mutator */
	negate() {
		this.x = -this.x
		this.y = -this.y
		this.z = -this.z
		return this
	}

	/** mutator */
	addBy(delta: number) {
		this.x += delta
		this.y += delta
		this.z += delta
		return this
	}

	/** mutator */
	multiplyBy(delta: number) {
		this.x *= delta
		this.y *= delta
		this.z *= delta
		return this
	}

	/** mutator */
	divideBy(divisor: number) {
		if (divisor === 0) return this
		this.x /= divisor
		this.y /= divisor
		this.z /= divisor
		return this
	}

	/** mutator */
	normalize() {
		return this.divideBy(this.magnitude())
	}

	/** mutator */
	clampMagnitude(max: number) {
		const magnitude = this.magnitude()
		if (magnitude > max) this.normalize().multiplyBy(max)
		return this
	}

	/** mutator */
	floor(): this {
		this.x = Math.floor(this.x)
		this.y = Math.floor(this.y)
		this.z = Math.floor(this.z)
		return this
	}

	/** mutator */
	ceil(): this {
		this.x = Math.ceil(this.x)
		this.y = Math.ceil(this.y)
		this.z = Math.ceil(this.z)
		return this
	}

	/** mutator */
	round(): this {
		this.x = Math.round(this.x)
		this.y = Math.round(this.y)
		this.z = Math.round(this.z)
		return this
	}

	///////////////////////////////////////////////////////////////////////

	/** mutator */
	cross_(x2: number, y2: number, z2: number) {
		const {x: x1, y: y1, z: z1} = this
		this.x = (y1 * z2) - (z1 * y2)
		this.y = (z1 * x2) - (x1 * z2)
		this.z = (x1 * y2) - (y1 * x2)
		return this
	}

	/** mutator */
	cross({x, y, z}: Xyz) {
		return this.cross_(x, y, z)
	}

	/** mutator */
	lerp_(x: number, y: number, z: number, fraction: number): this {
		this.x += (x - this.x) * fraction
		this.y += (y - this.y) * fraction
		this.z += (z - this.z) * fraction
		return this
	}

	/** mutator */
	lerp({x, y, z}: Xyz, fraction: number) {
		return this.lerp_(x, y, z, fraction)
	}

	approach_(x: number, y: number, z: number, speed: number, deltaTime: number, speedLimit?: number) {
		this.x = Scalar.approach(this.x, x, speed, deltaTime, speedLimit)
		this.y = Scalar.approach(this.y, y, speed, deltaTime, speedLimit)
		this.z = Scalar.approach(this.z, z, speed, deltaTime, speedLimit)
		return this
	}

	approach({x, y, z}: Xyz, speed: number, deltaTime: number, speedLimit?: number) {
		return this.approach_(x, y, z, speed, deltaTime, speedLimit)
	}

	/** mutator */
	projectOnto_(x: number, y: number, z: number) {
		const scalar = this.dot_(x, y, z) / Vec3.magnitudeSquared(x, y, z)
		this.x = scalar * x
		this.y = scalar * y
		this.z = scalar * z
		return this
	}

	/** mutator */
	projectOnto({x, y, z}: Vec3) {
		return this.projectOnto_(x, y, z)
	}

	/** mutator */
	reflect_(x: number, y: number, z: number) {
		const dot = this.dot_(x, y, z) * 2
		this.x -= dot * x
		this.y -= dot * y
		this.z -= dot * z
		return this
	}

	/** mutator */
	reflect({x, y, z}: Xyz) {
		return this.reflect_(x, y, z)
	}

	/** mutator */
	rotateAroundAxis_(ux: number, uy: number, uz: number, angle: number): this {
		const cos = Math.cos(angle)
		const sin = Math.sin(angle)
		const {x, y, z} = this
		this.x = (cos + (1 - cos) * ux * ux) * x + ((1 - cos) * ux * uy - uz * sin) * y + ((1 - cos) * ux * uz + uy * sin) * z
		this.y = ((1 - cos) * uy * ux + uz * sin) * x + (cos + (1 - cos) * uy * uy) * y + ((1 - cos) * uy * uz - ux * sin) * z
		this.z = ((1 - cos) * uz * ux - uy * sin) * x + ((1 - cos) * uz * uy + ux * sin) * y + (cos + (1 - cos) * uz * uz) * z
		return this
	}

	/** mutator */
	rotateAroundAxis({x, y, z}: Xyz, angle: number) {
		return this.rotateAroundAxis_(x, y, z, angle)
	}

	/** mutator */
	smooth_(x: number, y: number, z: number, smoothing: number) {
		this.x = Scalar.smooth(this.x, x, smoothing)
		this.y = Scalar.smooth(this.y, y, smoothing)
		this.z = Scalar.smooth(this.z, z, smoothing)
		return this
	}

	/** mutator */
	smooth({x, y, z}: Xyz, smoothing: number) {
		return this.smooth_(x, y, z, smoothing)
	}
}

