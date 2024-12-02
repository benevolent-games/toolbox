
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

	static import({x, y, z, w}: Xyzw) {
		return new this(x, y, z, w)
	}

	static from(v: Vec4Array | Xyzw) {
		return Array.isArray(v)
			? this.array(v)
			: this.import(v)
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

	/** mutator */
	map(fn: (a: number, index: number) => number) {
		this.x = fn(this.x, 0)
		this.y = fn(this.y, 1)
		this.z = fn(this.z, 2)
		this.w = fn(this.w, 3)
		return this
	}
}

