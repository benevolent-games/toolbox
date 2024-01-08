
import {Scene} from "@babylonjs/core/scene.js"
import {Camera} from "@babylonjs/core/Cameras/camera.js"
import {Vector3} from "@babylonjs/core/Maths/math.vector.js"
import {ArcRotateCamera} from "@babylonjs/core/Cameras/arcRotateCamera.js"
import {PostProcessRenderPipeline} from "@babylonjs/core/PostProcesses/RenderPipeline/postProcessRenderPipeline.js"

import {Effects} from "../types.js"
import {render_pipes} from "./render_pipes.js"
import {labeler} from "../../tools/labeler.js"
import {scalar} from "../../tools/math/scalar.js"

export class Rendering {
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

		if (effects?.bloom)
			this.#addPipe(pipes.def(effects.bloom))

		if (effects?.ssao)
			this.#addPipe(pipes.ssao(effects.ssao))

		if (effects?.ssr)
			this.#addPipe(pipes.ssr(effects.ssr))
	}

	#addPipe(pipe: PostProcessRenderPipeline) {
		this.#scene.postProcessRenderPipelineManager.addPipeline(pipe)
		this.#scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline(pipe.name, this.camera)
		this.#pipelines.add(pipe)
	}

	#deletePipe(pipe: PostProcessRenderPipeline) {
		this.#scene.postProcessRenderPipelineManager.detachCamerasFromRenderPipeline(pipe.name, this.camera)
		this.#scene.postProcessRenderPipelineManager.removePipeline(pipe.name)
		pipe.dispose()
		this.#pipelines.delete(pipe)
	}
}

