
import {Gimbal} from "../types/gimbal.js"
import {V2} from "@benev/nubs/x/tools/v2.js"
import {Quaternion} from "@babylonjs/core/Maths/math.vector.js"

export function apply_look_to_gimbal(look: V2, gimbal: Gimbal) {
	const [x, y] = look

	gimbal.b.rotationQuaternion = Quaternion
		.RotationYawPitchRoll(0, -y, 0)

	gimbal.a.rotationQuaternion = Quaternion
		.RotationYawPitchRoll(x, 0, 0)
}
