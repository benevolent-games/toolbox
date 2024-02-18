
import "@babylonjs/core/Culling/ray.js"
import "@babylonjs/loaders/glTF/index.js"
import "@babylonjs/core/Engines/index.js"
import "@babylonjs/core/Animations/index.js"
import "@babylonjs/core/Rendering/edgesRenderer.js"
import "@babylonjs/core/Rendering/depthRendererSceneComponent.js"
import "@babylonjs/core/Rendering/prePassRendererSceneComponent.js"
import "@babylonjs/core/Materials/Textures/Loaders/envTextureLoader.js"
import "@babylonjs/core/Rendering/geometryBufferRendererSceneComponent.js"

import {Scene} from "@babylonjs/core/scene.js"
import {Camera} from "@babylonjs/core/Cameras/camera.js"
import {Vector3} from "@babylonjs/core/Maths/math.vector.js"
import {ArcRotateCamera} from "@babylonjs/core/Cameras/arcRotateCamera.js"
import {PostProcessRenderPipeline} from "@babylonjs/core/PostProcesses/RenderPipeline/postProcessRenderPipeline.js"

import {radians} from "../../math/scalar.js"

export class Rendering {
	static effects = effects

	#camera!: Camera
	#scene: Scene
	#effects: Effects | null = null

	#pipes: Set<{pipeline: PostProcessRenderPipeline, dispose:}>
	#pipelines = new Set<PostProcessRenderPipeline>()

	readonly fallbackCamera: ArcRotateCamera

	constructor(scene: Scene) {
		this.#scene = scene

		scene.enableDepthRenderer()

		this.fallbackCamera = (() => {
			const alpha = 0
			const beta = radians.from.degrees(60)
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
		for (const pipe of [...this.#pipelines])
			this.#deletePipe(pipe)

		const pipes = render_pipes(this.#scene)

		if (effects?.default)
			this.#addPipe(pipes.default(effects.default))

		if (effects?.ssao)
			this.#addPipe(pipes.ssao(effects.ssao))

		if (effects?.ssr)
			this.#addPipe(pipes.ssr(effects.ssr))

		this.#reattachCameras()
	}

	#reattachCameras() {
		for (const pipe of this.#pipelines) {
			this.#scene.postProcessRenderPipelineManager
				.detachCamerasFromRenderPipeline(pipe.name, this.camera)

			this.#scene.postProcessRenderPipelineManager
				.attachCamerasToRenderPipeline(pipe.name, this.camera)
		}
	}

	#addPipe(pipe: PostProcessRenderPipeline) {
		// pipelines add themselves to the manager automatically on construction
		this.#pipelines.add(pipe)
	}

	#delete_all_pipes() {
		for (const pipe of [...this.#pipelines])
	}

	#deletePipe(pipe: PostProcessRenderPipeline) {
		// some pipelines remove themselves from the manager, some do not.
		// to be safe, we call removePipeline in every case.
		this.#scene.postProcessRenderPipelineManager.removePipeline(pipe.name)
		pipe.dispose()
		this.#pipelines.delete(pipe)
	}
}

