import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"
import {Quaternion} from "@babylonjs/core/Maths/math.vector.js"
import {v2} from "../../../utils/v2.js"
export function transformRotate(currentLook: v2.V2, transformA: TransformNode, transformB: TransformNode) {
	const [x, y] = currentLook
	transformB.rotationQuaternion = Quaternion.RotationYawPitchRoll(
		0, -y, 0,
	)
	transformA.rotationQuaternion = Quaternion.RotationYawPitchRoll(
		x, 0, 0
	)
}
