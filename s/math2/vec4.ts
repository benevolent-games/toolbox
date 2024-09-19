
export type Vec4Array = [number, number, number, number]

export class Vec4 {
	constructor(
		public x = 0,
		public y = 0,
		public z = 0,
		public w = 0,
	) {}

	static new(x = 0, y = 0, z = 0, w = 0) {
		return new this(x, y, z, w)
	}

	static zero() {
		return new this(0, 0, 0, 0)
	}

	static array(v: Vec4Array) {
		return new this(...v)
	}

	array(): Vec4Array {
		const {x, y, z, w} = this
		return [x, y, z, w]
	}

	copy() {
		return new Vec4(...this.array())
	}

	set(x: number, y: number, z: number, w: number) {
		this.x = x
		this.y = y
		this.z = z
		this.w = w
	}
}

