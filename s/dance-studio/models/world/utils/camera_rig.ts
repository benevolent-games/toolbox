
import {Scene} from "@babylonjs/core/scene.js"
import {Vector3} from "@babylonjs/core/Maths/math.vector.js"
import {ArcRotateCamera} from "@babylonjs/core/Cameras/arcRotateCamera.js"

import {scalar} from "../../../../tools/math/scalar.js"

export class CameraRig {
	#camera: ArcRotateCamera
	#zoom = 2 / 10
	#swivel = 3 / 10

	constructor(scene: Scene) {
		const name = "cam"
		const alpha = 0
		const beta = Math.PI * (1 /3)
		const radius = 3
		const target = new Vector3(0, 1, 0)

		this.#camera = new ArcRotateCamera(
			name, alpha, beta, radius, target,
			scene,
		)
	}

	get zoom() {
		return this.#zoom
	}

	get swivel() {
		return this.#swivel
	}

	set zoom(n: number) {
		this.#zoom = scalar.clamp(n)
		this.#camera.radius = scalar.map(this.#zoom, [1.5, 5])
		this.#camera.beta = scalar.map(this.#zoom, [scalar.pi(0.5), scalar.pi(0)])
	}

	set swivel(n: number) {
		this.#swivel = scalar.wrap(n)
		this.#camera.alpha = scalar.map(this.#swivel, [0, scalar.pi(2)])
	}
}

