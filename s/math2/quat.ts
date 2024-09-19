
export type QuatArray = [number, number, number, number]
export type Xyzw = {x: number, y: number, z: number, w: number}

export class Quat {
	constructor(
		public x: number = 0,
		public y: number = 0,
		public z: number = 0,
		public w: number = 1,
	) {}

	static new(x = 0, y = 0, z = 0, w = 1) {
		return new this(x, y, z, w)
	}

	static array(q: QuatArray) {
		return new this(...q)
	}

	static identity() {
		return new this()
	}

	static import({x, y, z, w}: Xyzw) {
		return new this(x, y, z, w)
	}

	array(): QuatArray {
		const {x, y, z, w} = this
		return [x, y, z, w]
	}

	clone() {
		return new Quat(...this.array())
	}

	set(x: number, y: number, z: number, w: number) {
		this.x = x
		this.y = y
		this.z = z
		this.w = w
		return this
	}

	multiply(...quats: Quat[]): Quat {
		let {x, y, z, w} = this
		for (const {x: x2, y: y2, z: z2, w: w2} of quats) {
			x = w * x2 + x * w2 + y * z2 - z * y2
			y = w * y2 - x * z2 + y * w2 + z * x2
			z = w * z2 + x * y2 - y * x2 + z * w2
			w = w * w2 - x * x2 - y * y2 - z * z2
		}
		return this.set(x, y, z, w)
	}
}

