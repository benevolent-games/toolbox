
export type Vec3Array = [number, number, number]
export type Xyz = {x: number, y: number, z: number}

export class Vec3 {
	constructor(
		public x = 0,
		public y = 0,
		public z = 0,
	) {}

	//
	// statics
	//

	static new(x: number, y: number, z: number) {
		return new this(x, y, z)
	}

	static zero() {
		return new this(0, 0, 0)
	}

	static import({x, y, z}: Xyz): Vec3 {
		return new this(x, y, z)
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

	//
	// fundamentals
	//

	clone() {
		return new Vec3(this.x, this.y, this.z)
	}

	array(): Vec3Array {
		return [this.x, this.y, this.z]
	}

	set(x: number, y: number, z: number) {
		this.x = x
		this.y = y
		this.z = z
	}

	//
	// queries
	//

	equal(a: Vec3, ...b: Vec3[]) {
		for (const {x: x2, y: y2, z: z2} of [a, ...b]) {
			if (this.x !== x2 || this.y !== y2 || this.z !== z2)
				return false
		}
		return true
	}

	magnitude(): number {
		return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2)
	}

	distance(b: Vec3): number {
		const dx = this.x - b.x
		const dy = this.y - b.y
		const dz = this.z - b.z
		return Math.sqrt(dx ** 2 + dy ** 2 + dz ** 2)
	}

	dot(b: Vec3): number {
		return (this.x * b.x) + (this.y * b.y) + (this.z * b.z)
	}

	withinCircle(center: Vec3, radius: number): boolean {
		const distanceSquared = this.copy().subtract(center).magnitude() ** 2
		return distanceSquared < radius ** 2
	}

	sum(...vectors: Vec3[]) {
		const result = new Vec3(0, 0, 0)
		for (const vector of vectors) {
			result.add(vector)
		}
		return result
	}

	average(...vectors: Vec3[]) {
		const sum = this.sum(...vectors)
		return sum.divideBy(vectors.length)
	}

	toHexColor(): string {
		const to255 = (val: number) => Math.round(val * 255)
		const toHex = (val: number) => to255(val).toString(16).padStart(2, '0')
		return `#${toHex(this.x)}${toHex(this.y)}${toHex(this.z)}`
	}

	angleBetween(b: Vec3): number {
		const dotProduct = this.dot(b)
		const magnitudes = this.magnitude() * b.magnitude()
		return Math.acos(dotProduct / magnitudes) // returns radians
	}

	//
	// chainable transforms
	//

	add(...vectors: Vec3[]) {
		for (const vector of vectors) {
			this.x += vector.x
			this.y += vector.y
			this.z += vector.z
		}
		return this
	}

	subtract(b: Vec3) {
		this.x -= b.x
		this.y -= b.y
		this.z -= b.z
		return this
	}

	multiply(...vectors: Vec3[]) {
		for (const vector of vectors) {
			this.x *= vector.x
			this.y *= vector.y
			this.z *= vector.z
		}
		return this
	}

	negate() {
		this.x = -this.x
		this.y = -this.y
		this.z = -this.z
		return this
	}

	addBy(delta: number) {
		this.x += delta
		this.y += delta
		this.z += delta
		return this
	}

	multiplyBy(delta: number) {
		this.x *= delta
		this.y *= delta
		this.z *= delta
		return this
	}

	divideBy(delta: number) {
		if (delta !== 0) {
			this.x /= delta
			this.y /= delta
			this.z /= delta
		}
		return this
	}

	normalize() {
		const length = this.magnitude()
		if (length !== 0) {
			this.x /= length
			this.y /= length
			this.z /= length
		}
		return this
	}

	cross(b: Vec3) {
		const {x: x1, y: y1, z: z1} = this
		const {x: x2, y: y2, z: z2} = b
		this.x = (y1 * z2) - (z1 * y2)
		this.y = (z1 * x2) - (x1 * z2)
		this.z = (x1 * y2) - (y1 * x2)
		return this
	}

	lerp(target: Vec3, fraction: number): this {
		this.x += (target.x - this.x) * fraction
		this.y += (target.y - this.y) * fraction
		this.z += (target.z - this.z) * fraction
		return this
	}

	projectOnto(b: Vec3): this {
		const scalar = this.dot(b) / b.magnitude() ** 2
		this.x = scalar * b.x
		this.y = scalar * b.y
		this.z = scalar * b.z
		return this
	}

	clampMagnitude(max: number): this {
		const mag = this.magnitude()
		if (mag > max) {
			this.normalize().multiplyBy(max)
		}
		return this
	}

	reflect(normal: Vec3): this {
		const dotProduct = this.dot(normal) * 2
		this.x -= dotProduct * normal.x
		this.y -= dotProduct * normal.y
		this.z -= dotProduct * normal.z
		return this
	}

	floor(): this {
		this.x = Math.floor(this.x)
		this.y = Math.floor(this.y)
		this.z = Math.floor(this.z)
		return this
	}

	ceil(): this {
		this.x = Math.ceil(this.x)
		this.y = Math.ceil(this.y)
		this.z = Math.ceil(this.z)
		return this
	}

	round(): this {
		this.x = Math.round(this.x)
		this.y = Math.round(this.y)
		this.z = Math.round(this.z)
		return this
	}

	rotateAroundAxis(axis: Vec3, angle: number): this {
		const cos = Math.cos(angle)
		const sin = Math.sin(angle)
		const {x, y, z} = this
		const {x: ux, y: uy, z: uz} = axis

		this.x = (cos + (1 - cos) * ux * ux) * x + ((1 - cos) * ux * uy - uz * sin) * y + ((1 - cos) * ux * uz + uy * sin) * z
		this.y = ((1 - cos) * uy * ux + uz * sin) * x + (cos + (1 - cos) * uy * uy) * y + ((1 - cos) * uy * uz - ux * sin) * z
		this.z = ((1 - cos) * uz * ux - uy * sin) * x + ((1 - cos) * uz * uy + ux * sin) * y + (cos + (1 - cos) * uz * uz) * z

		return this
	}
}

