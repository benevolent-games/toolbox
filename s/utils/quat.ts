
import {Quaternion} from "@babylonjs/core/Maths/math.vector.js"

export type Quat = quat.Quat

export namespace quat {
	export type Quat = [number, number, number, number]

	export function zero(): Quat {
		return [0, 0, 0, 0]
	}

	export function toBabylon(q: Quat) {
		return new Quaternion(...q)
	}

	export function fromBabylon(
			{x, y, z, w}: Quaternion
		): [number, number, number, number] {
		return [x, y, z, w]
	}
}

