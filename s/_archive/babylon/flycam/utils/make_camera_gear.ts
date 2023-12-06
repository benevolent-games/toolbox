
import {Scene} from "@babylonjs/core/scene.js"
import {Vector3} from "@babylonjs/core/Maths/math.vector.js"
import {TargetCamera} from "@babylonjs/core/Cameras/targetCamera.js"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"

import {Gimbal} from "../types/gimbal.js"

export function make_camera_gear(scene: Scene) {

	const gimbal: Gimbal = {
		a: new TransformNode("camera_gimbal_a", scene),
		b: new TransformNode("camera_gimbal_b", scene),
	}

	const camera = new TargetCamera("fly_camera", Vector3.Zero(), scene)
	camera.ignoreParentScaling = true
	camera.parent = gimbal.b
	gimbal.b.parent = gimbal.a

	return {camera, gimbal}
}
