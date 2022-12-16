
import {Scene} from "@babylonjs/core/scene.js"
import {Vector3} from "@babylonjs/core/Maths/math.vector.js"
import {ArcRotateCamera} from "@babylonjs/core/Cameras/arcRotateCamera.js"

export function arcCameraLookingAtOrigin(scene: Scene) {
	const alpha =  Math.PI / 4
	const beta = Math.PI / 3
	const radius = 8
	const target = new Vector3(0, 0, 0)
	return new ArcRotateCamera(
		"cam",
		alpha,
		beta,
		radius,
		target,
		scene,
	)
}
