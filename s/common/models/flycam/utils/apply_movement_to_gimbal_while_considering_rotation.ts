
import {Gimbal} from "../types/gimbal.js"
import {Vec2} from "../../../../tools/math/vec2.js"
import {Vector3} from "@babylonjs/core/Maths/math.js"

export function apply_movement_to_gimbal_while_considering_rotation(
	vector: Vec2,
	gimbal: Gimbal,
	) {

	const [x, z] = vector
	const translation = new Vector3(x, 0, z)

	const translation_considering_rotation = translation
		.applyRotationQuaternion(gimbal.b.absoluteRotationQuaternion)

	gimbal.a.position.addInPlace(translation_considering_rotation)
}
