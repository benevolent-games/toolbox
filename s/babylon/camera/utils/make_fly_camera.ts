
import {Scene} from "@babylonjs/core/scene.js"
import {Vector3} from "@babylonjs/core/Maths/index.js"
import {Quaternion} from "@babylonjs/core/Maths/math.vector.js"
import {TargetCamera} from "@babylonjs/core/Cameras/targetCamera.js"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"

import {V3} from "../../../utils/v3.js"
import {V2, v2} from "../../../utils/v2.js"
import {cap} from "../../../utils/numpty.js"

export function make_fly_camera({scene, position}: {
		scene: Scene
		position: V3
	}) {

	const transformA = new TransformNode("camA", scene)
	const transformB = new TransformNode("camB", scene)

	const camera = (() => {
		const name = "fly_camera"
		const pos = new Vector3(...position)
		return new TargetCamera(name, pos, scene)
	})()

	camera.ignoreParentScaling = true
	camera.parent = transformB
	transformB.parent = transformA

	let currentLook = v2.zero()

	return {

		add_look: (vector: V2) => {
			const radian = Math.PI / 2
			currentLook = v2.add(currentLook, vector)
			currentLook[1] = cap(currentLook[1], -radian, radian)

			const [x, y] = currentLook
			transformB.rotationQuaternion = Quaternion.RotationYawPitchRoll(
				0, -y, 0,
			)
			transformA.rotationQuaternion = Quaternion.RotationYawPitchRoll(
				x, 0, 0
			)
		},

		add_move: ([x,z]: V2) => {
			const translation = new Vector3(x, 0, z)
			const newPosition = translation.applyRotationQuaternion(
				transformB.absoluteRotationQuaternion
			)
			transformA.position.addInPlace(newPosition)
		},
	}
}
