
export type Vec3Array = [number, number, number]
export type Xyz = {x: number, y: number, z: number}

export class Vec3 {
	constructor(
		public x: number,
		public y: number,
		public z: number,
	) {}

	///////////////////////////////////////////////////////////////////////

	static new(x: number, y: number, z: number) {
		return new this(x, y, z)
	}

	static zero() {
		return new this(0, 0, 0)
	}

	static array(v: Vec3Array) {
		return new this(...v)
	}

	static import({x, y, z}: Xyz): Vec3 {
		return new this(x, y, z)
	}

	static magnitudeSquared(x: number, y: number, z: number) {
		return (x ** 2) + (y ** 2) + (z ** 2)
	}

	static magnitude(x: number, y: number, z: number) {
		return Math.sqrt(this.magnitudeSquared(x, y, z))
	}

	static average(...vecs: Xyz[]) {
		return Vec3.zero()
			.addV(...vecs)
			.divideBy(vecs.length)
	}

	static fromHexColor(hex: string): Vec3 {
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

	set(x: number, y: number, z: number) {
		this.x = x
		this.y = y
		this.z = z
		return this
	}

	setV({x, y, z}: Xyz) {
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

	equals(x: number, y: number, z: number) {
		return (
			this.x === x &&
			this.y === y &&
			this.z === z
		)
	}

	equalsV(...vecs: Xyz[]) {
		return vecs.every(v => this.equals(v.x, v.y, v.z))
	}

	distanceSquared(x: number, y: number, z: number) {
		const dx = this.x - x
		const dy = this.y - y
		const dz = this.z - z
		return (dx ** 2) + (dy ** 2) + (dz ** 2)
	}

	distanceSquaredV({x, y, z}: Xyz) {
		return this.distanceSquared(x, y, z)
	}

	distance(x: number, y: number, z: number) {
		return Math.sqrt(this.distanceSquared(x, y, z))
	}

	distanceV({x, y, z}: Xyz) {
		return this.distance(x, y, z)
	}

	dot(x: number, y: number, z: number) {
		return (this.x * x) + (this.y * y) + (this.z * z)
	}

	dotV({x, y, z}: Xyz) {
		return this.dot(x, y, z)
	}

	inRange(x: number, y: number, z: number, radius: number) {
		const d2 = this.distanceSquared(x, y, z)
		return d2 < (radius ** 2)
	}

	inRangeV({x, y, z}: Xyz, radius: number) {
		return this.inRange(x, y, z, radius)
	}

	toHexColor() {
		const to255 = (val: number) => Math.round(val * 255)
		const toHex = (val: number) => to255(val).toString(16).padStart(2, '0')
		return `#${toHex(this.x)}${toHex(this.y)}${toHex(this.z)}`
	}

	angleBetween(x: number, y: number, z: number) {
		const dotProduct = this.dot(x, y, z)
		const magnitudes = this.magnitude() * Vec3.new(x, y, z).magnitude()
		return Math.acos(dotProduct / magnitudes)
	}

	angleBetweenV({x, y, z}: Xyz) {
		return this.angleBetween(x, y, z)
	}

	///////////////////////////////////////////////////////////////////////

	/** mutator */
	add(x: number, y: number, z: number) {
		this.x += x
		this.y += y
		this.z += z
		return this
	}

	/** mutator */
	addV(...vecs: Xyz[]) {
		for (const {x, y, z} of vecs) this.add(x, y, z)
		return this
	}

	/** mutator */
	subtract(x: number, y: number, z: number) {
		this.x -= x
		this.y -= y
		this.z -= z
		return this
	}

	/** mutator */
	subtractV(...vecs: Xyz[]) {
		for (const {x, y, z} of vecs) this.subtract(x, y, z)
		return this
	}

	/** mutator */
	multiply(x: number, y: number, z: number) {
		this.x *= x
		this.y *= y
		this.z *= z
		return this
	}

	/** mutator */
	multiplyV(...vecs: Vec3[]) {
		for (const {x, y, z} of vecs) this.multiply(x, y, z)
		return this
	}

	/** mutator */
	each(fn: (a: number) => number) {
		this.x = fn(this.x)
		this.y = fn(this.y)
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
	divideBy(delta: number) {
		if (delta !== 0) {
			this.x /= delta
			this.y /= delta
			this.z /= delta
		}
		return this
	}

	/** mutator */
	normalize() {
		return this.divideBy(this.magnitude())
	}

	/** mutator */
	cross(x2: number, y2: number, z2: number) {
		const {x: x1, y: y1, z: z1} = this
		this.x = (y1 * z2) - (z1 * y2)
		this.y = (z1 * x2) - (x1 * z2)
		this.z = (x1 * y2) - (y1 * x2)
		return this
	}

	/** mutator */
	crossV({x, y, z}: Xyz) {
		return this.cross(x, y, z)
	}

	/** mutator */
	lerp(x: number, y: number, z: number, fraction: number): this {
		this.x += (x - this.x) * fraction
		this.y += (y - this.y) * fraction
		this.z += (z - this.z) * fraction
		return this
	}

	/** mutator */
	lerpV({x, y, z}: Xyz, fraction: number) {
		return this.lerp(x, y, z, fraction)
	}

	/** mutator */
	projectOnto(x: number, y: number, z: number) {
		const scalar = this.dot(x, y, z) / Vec3.magnitudeSquared(x, y, z)
		this.x = scalar * x
		this.y = scalar * y
		this.z = scalar * z
		return this
	}

	/** mutator */
	projectOntoV({x, y, z}: Vec3) {
		return this.projectOnto(x, y, z)
	}

	/** mutator */
	clampMagnitude(max: number) {
		const magnitude = this.magnitude()
		if (magnitude > max) this.normalize().multiplyBy(max)
		return this
	}

	/** mutator */
	reflect(x: number, y: number, z: number) {
		const dot = this.dot(x, y, z) * 2
		this.x -= dot * x
		this.y -= dot * y
		this.z -= dot * z
		return this
	}

	/** mutator */
	reflectV({x, y, z}: Xyz) {
		return this.reflect(x, y, z)
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

	/** mutator */
	rotateAroundAxis(ux: number, uy: number, uz: number, angle: number): this {
		const cos = Math.cos(angle)
		const sin = Math.sin(angle)
		const {x, y, z} = this
		this.x = (cos + (1 - cos) * ux * ux) * x + ((1 - cos) * ux * uy - uz * sin) * y + ((1 - cos) * ux * uz + uy * sin) * z
		this.y = ((1 - cos) * uy * ux + uz * sin) * x + (cos + (1 - cos) * uy * uy) * y + ((1 - cos) * uy * uz - ux * sin) * z
		this.z = ((1 - cos) * uz * ux - uy * sin) * x + ((1 - cos) * uz * uy + ux * sin) * y + (cos + (1 - cos) * uz * uz) * z
		return this
	}

	/** mutator */
	rotateAroundAxisV({x, y, z}: Xyz, angle: number) {
		return this.rotateAroundAxis(x, y, z, angle)
	}
}

