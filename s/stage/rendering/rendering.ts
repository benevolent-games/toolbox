
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

import {radians} from "../../math/scalar.js"
import {setup_effects} from "./effects/setup.js"
import {EffectRig, Effects} from "./effects/types.js"
import {standard_effects} from "./effects/standard.js"

export class Rendering {
	static effects = standard_effects

	readonly fallbackCamera: ArcRotateCamera
	#scene: Scene
	#camera!: Camera
	#rig: EffectRig = {
		effects: null,
		pipelines: [],
		dispose: () => {},
	}

	constructor(scene: Scene) {
		this.#scene = scene

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

	get #pipelines() {
		return this.#rig
			? this.#rig.pipelines
			: []
	}

	get camera() {
		return this.#camera
	}

	setCamera(camera: Camera | null) {
		camera ??= this.fallbackCamera
		const previous = this.#camera
		const pipelines = this.#pipelines

		if (previous)
			for (const pipe of pipelines)
				this.#scene.postProcessRenderPipelineManager
					.detachCamerasFromRenderPipeline(pipe.name, previous)

		for (const pipe of pipelines)
			this.#scene.postProcessRenderPipelineManager
				.attachCamerasToRenderPipeline(pipe.name, camera)

		this.#camera = camera
		this.#scene.activeCamera = camera
		return camera
	}

	get effects() {
		return this.#rig.effects
	}

	setEffects(effects: Partial<Effects> | null) {
		const camera = this.#camera

		// detach camera from all pipes
		for (const pipe of this.#rig.pipelines)
			this.#scene.postProcessRenderPipelineManager.detachCamerasFromRenderPipeline(pipe.name, camera)

		// dispose previous rig, pipelines and everything
		this.#rig.dispose()

		// create new rig
		this.#rig = effects
			? setup_effects(this.#scene, effects)
			: {effects: null, pipelines: [], dispose: () => {}}
	}
}

