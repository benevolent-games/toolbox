
import {Quaternion} from "@babylonjs/core/Maths/math.vector.js"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"

export function assert_babylon_quaternion(transform: TransformNode) {
	return transform.rotationQuaternion ?? (
		transform.rotationQuaternion = Quaternion.RotationYawPitchRoll(
			transform.rotation.y,
			transform.rotation.x,
			transform.rotation.z,
		)
	)
}

