
import {Scene} from "@babylonjs/core/scene.js"
import {Vector3} from "@babylonjs/core/Maths/math.vector.js"
import {ArcRotateCamera} from "@babylonjs/core/Cameras/arcRotateCamera.js"

import {scalar} from "../../../../tools/math/scalar.js"

export class Jib {
	readonly camera: ArcRotateCamera

	constructor(scene: Scene) {
		const name = "cam"
		const alpha = 0
		const beta = Math.PI * (1 /3)
		const radius = 3
		const target = new Vector3(0, 1, 0)

		this.camera = new ArcRotateCamera(
			name, alpha, beta, radius, target,
			scene,
		)
	}

	swivel(degrees: number) {
		this.camera.alpha = scalar.radians(degrees)
	}

	zoom(distance: number) {
		this.camera.radius = distance
	}
}

