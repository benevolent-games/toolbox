
import "@babylonjs/core/Culling/ray.js"
import "@babylonjs/loaders/glTF/index.js"
import "@babylonjs/core/Engines/index.js"
import "@babylonjs/core/Animations/index.js"
import "@babylonjs/core/Rendering/edgesRenderer.js"
import "@babylonjs/core/Rendering/boundingBoxRenderer.js"
import "@babylonjs/core/Rendering/depthRendererSceneComponent.js"
import "@babylonjs/core/Rendering/prePassRendererSceneComponent.js"
import "@babylonjs/core/Materials/Textures/Loaders/envTextureLoader.js"
import "@babylonjs/core/Rendering/geometryBufferRendererSceneComponent.js"

import {pubsub} from "@benev/slate"
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
	readonly onEffectsChange = pubsub<[Partial<Effects> | null]>()

	#scene: Scene
	#camera!: Camera
	#rig: EffectRig = {
		effects: null,
		pipelines: [],
		dispose: () => {},
	}
	get #pipelines() {
		return this.#rig
			? this.#rig.pipelines
			: []
	}

	constructor(scene: Scene) {
		this.#scene = scene

		scene.enablePrePassRenderer()

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

		this.#detachCamera(previous)
		this.#camera = camera
		this.#scene.activeCamera = camera
		this.setEffects(this.effects)

		return camera
	}

	get effects() {
		return this.#rig.effects
	}

	setEffects(effects: Partial<Effects> | null) {
		const camera = this.#camera
		this.#detachCamera(camera)

		this.#rig.dispose()
		this.#rig = effects
			? setup_effects(this.#scene, effects, camera)
			: {effects: null, pipelines: [], dispose: () => {}}

		this.#attachCamera(camera)
		this.onEffectsChange.publish(this.#rig.effects)
	}

	#detachCamera(camera: Camera) {
		const pipelines = this.#pipelines
		const manager = this.#scene.postProcessRenderPipelineManager
		for (const pipe of pipelines)
			manager.detachCamerasFromRenderPipeline(pipe.name, camera)
	}

	#attachCamera(camera: Camera) {
		const pipelines = this.#pipelines
		const manager = this.#scene.postProcessRenderPipelineManager
		for (const pipe of pipelines)
			if (!pipe.cameras.includes(camera))
				manager.attachCamerasToRenderPipeline(pipe.name, camera)
	}
}

