
import {Vec3} from "./vec3.js"

export type QuatArray = [number, number, number, number]
export type Xyzw = {x: number, y: number, z: number, w: number}

export class Quat {
	constructor(
		public x: number,
		public y: number,
		public z: number,
		public w: number,
	) {}

	static new(x: number, y: number, z: number, w: number) {
		return new this(x, y, z, w)
	}

	static array(q: QuatArray) {
		return new this(...q)
	}

	static identity() {
		return new this(0, 0, 0, 1)
	}

	static import({x, y, z, w}: Xyzw) {
		return new this(x, y, z, w)
	}

	static rotated_(yaw: number, pitch: number, roll: number) {
		return this.identity().rotate_(yaw, pitch, roll)
	}

	static rotated(vec: Vec3) {
		return this.identity().rotate(vec)
	}

	array(): QuatArray {
		const {x, y, z, w} = this
		return [x, y, z, w]
	}

	toString() {
		return `(Quat x${this.x.toFixed(2)}, y${this.y.toFixed(2)}, z${this.z.toFixed(2)}, w${this.w.toFixed(2)})`
	}

	clone() {
		return new Quat(...this.array())
	}

	rotate_(yaw: number, pitch: number, roll: number): Quat {
		const cy = Math.cos(yaw * 0.5), sy = Math.sin(yaw * 0.5)
		const cp = Math.cos(pitch * 0.5), sp = Math.sin(pitch * 0.5)
		const cr = Math.cos(roll * 0.5), sr = Math.sin(roll * 0.5)
		const x = sr * cp * cy - cr * sp * sy
		const y = cr * sp * cy + sr * cp * sy
		const z = cr * cp * sy - sr * sp * cy
		const w = cr * cp * cy + sr * sp * sy
		return this.multiply_(x, y, z, w)
	}

	rotate({y: yaw, x: pitch, z: roll}: Vec3) {
		return this.rotate_(yaw, pitch, roll)
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

	multiply_(x2: number, y2: number, z2: number, w2: number): Quat {
		const {x, y, z, w} = this
		this.x = w * x2 + x * w2 + y * z2 - z * y2
		this.y = w * y2 - x * z2 + y * w2 + z * x2
		this.z = w * z2 + x * y2 - y * x2 + z * w2
		this.w = w * w2 - x * x2 - y * y2 - z * z2
		return this
	}

	multiply(...quats: Quat[]) {
		for (const {x, y, z, w} of quats) this.multiply_(x, y, z, w)
		return this
	}
}

