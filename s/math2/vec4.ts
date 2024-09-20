
import {Xyzw} from "./quat.js"

export type Vec4Array = [number, number, number, number]

export class Vec4 {
	constructor(
		public x: number,
		public y: number,
		public z: number,
		public w: number,
	) {}

	static new(x: number, y: number, z: number, w: number) {
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

	toString() {
		return `(Vec4 x${this.x.toFixed(2)}, y${this.y.toFixed(2)}, z${this.z.toFixed(2)}, w${this.w.toFixed(2)})`
	}

	clone() {
		return new Vec4(...this.array())
	}

	set_(x: number, y: number, z: number, w: number) {
		this.x = x
		this.y = y
		this.z = z
		this.w = w
		return this
	}

	set({x, y, z, w}: Xyzw) {
		this.x = x
		this.y = y
		this.z = z
		this.w = w
		return this
	}
}

