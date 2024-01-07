
import {Scene} from "@babylonjs/core/scene.js"
import {Camera} from "@babylonjs/core/Cameras/camera.js"
import {Vector3} from "@babylonjs/core/Maths/math.vector.js"
import {ArcRotateCamera} from "@babylonjs/core/Cameras/arcRotateCamera.js"

import {Rendering} from "./rendering.js"
import {scalar} from "../../tools/math/scalar.js"

export class Cam {
	#camera!: Camera
	readonly fallback: ArcRotateCamera

	constructor(private scene: Scene, private rendering: Rendering) {
		this.fallback = (() => {
			const alpha = 0
			const beta = scalar.radians.from.degrees(60)
			const radius = 2
			const target = new Vector3(0, 1.5, 0)
			return new ArcRotateCamera(
				"fallbackCamera",
				alpha, beta, radius, target,
				scene,
			)
		})()
		this.set(this.fallback)
	}

	get current() {
		return this.#camera
	}

	set(camera: Camera = this.fallback) {
		const previous = this.#camera

		for (const pipe of this.rendering.pipelines)
			this.scene.postProcessRenderPipelineManager
				.detachCamerasFromRenderPipeline(pipe.name, previous)

		for (const pipe of this.rendering.pipelines)
			this.scene.postProcessRenderPipelineManager
				.attachCamerasToRenderPipeline(pipe.name, camera)

		this.scene.activeCamera = camera
	}
}

