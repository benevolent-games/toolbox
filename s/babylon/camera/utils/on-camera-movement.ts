import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"
import {Vector3} from "@babylonjs/core/Maths/math.vector.js"
import {v2} from "../../../utils/v2.js"

export function onCameraMovement({
		getUpdateStarters,
		updateCameraPosition}: {
			getUpdateStarters: () => {getForce: () => v2.V2, transformB: TransformNode}
			updateCameraPosition: (position: any) => void
		}) {
		const {getForce, transformB} = getUpdateStarters()
		const [x, z] = getForce()
		const translation = new Vector3(x, 0, z)
		const newPosition = translation.applyRotationQuaternion(
			transformB.absoluteRotationQuaternion
		)
		updateCameraPosition(newPosition)
	}
