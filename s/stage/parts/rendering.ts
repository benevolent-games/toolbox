
import {Scene} from "@babylonjs/core/scene.js"
import {Camera} from "@babylonjs/core/Cameras/camera.js"
import {Vector3} from "@babylonjs/core/Maths/math.vector.js"
import {ArcRotateCamera} from "@babylonjs/core/Cameras/arcRotateCamera.js"
import {PostProcessRenderPipeline} from "@babylonjs/core/PostProcesses/RenderPipeline/postProcessRenderPipeline.js"

import {Effects} from "../types.js"
import {effects} from "./standards.js"
import {render_pipes} from "./render_pipes.js"
import {labeler} from "../../tools/labeler.js"
import {scalar} from "../../tools/math/scalar.js"

export class Rendering {
	static effects = effects

	#camera!: Camera
	#scene: Scene
	#label = labeler("pipeline")
	#effects: Effects | null = null
	#pipelines = new Set<PostProcessRenderPipeline>()

	readonly fallbackCamera: ArcRotateCamera

	constructor(scene: Scene) {
		this.#scene = scene

		this.fallbackCamera = (() => {
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

		this.setCamera(this.fallbackCamera)
	}

	get camera() {
		return this.#camera
	}

	setCamera(camera: Camera | null) {
		camera ??= this.fallbackCamera
		const previous = this.#camera

		if (previous)
			for (const pipe of this.#pipelines)
				this.#scene.postProcessRenderPipelineManager
					.detachCamerasFromRenderPipeline(pipe.name, previous)

		for (const pipe of this.#pipelines)
			this.#scene.postProcessRenderPipelineManager
				.attachCamerasToRenderPipeline(pipe.name, camera)

		this.#camera = camera
		this.#scene.activeCamera = camera
		return camera
	}

	get effects() {
		return this.#effects
	}

	setEffects(effects: Effects | null) {
		const pipes = render_pipes(this.#scene, this.#label)

		for (const pipe of [...this.#pipelines])
			this.#deletePipe(pipe)

		if (effects?.default)
			this.#addPipe(pipes.default(effects.default))

		if (effects?.ssao)
			this.#addPipe(pipes.ssao(effects.ssao))

		if (effects?.ssr)
			this.#addPipe(pipes.ssr(effects.ssr))
	}

	#addPipe(pipe: PostProcessRenderPipeline) {
		// pipelines add themselves to the manager automatically on construction
		this.#pipelines.add(pipe)
	}

	#deletePipe(pipe: PostProcessRenderPipeline) {
		// some pipelines remove themselves from the manager, some do not.
		// to be safe, we call removePipeline in every case.
		this.#scene.postProcessRenderPipelineManager.removePipeline(pipe.name)
		pipe.dispose()
		this.#pipelines.delete(pipe)
	}
}

