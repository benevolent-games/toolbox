
import {interval, pub} from "@benev/slate"
import {Scene} from "@babylonjs/core/scene.js"
import {Camera} from "@babylonjs/core/Cameras/camera.js"
import {Engine} from "@babylonjs/core/Engines/engine.js"
import {Color4, Vector3} from "@babylonjs/core/Maths/math.js"
import {SceneLoader} from "@babylonjs/core/Loading/sceneLoader.js"
import {ArcRotateCamera} from "@babylonjs/core/Cameras/arcRotateCamera.js"
import {SSAO2RenderingPipeline, SSRRenderingPipeline} from "@babylonjs/core/PostProcesses/index.js"

import {scalar} from "../../../tools/math/scalar.js"
import {fix_animation_groups} from "../../../dance-studio/models/loader/character/utils/fix_animation_groups.js"

export class Plate {
	#running = false

	engine: Engine
	scene: Scene
	fallbackCamera: ArcRotateCamera

	onRender = pub<void>()
	onTick = pub<void>()

	constructor(canvas: HTMLCanvasElement) {
		this.engine = new Engine(canvas)
		this.scene = new Scene(this.engine)

		this.scene.clearColor = new Color4(
			0.1, 0.1, 0.1, 1,
		)

		const ssao = new SSAO2RenderingPipeline("ssao", this.scene, 0.75)
		ssao.totalStrength = 3
		ssao.radius = 5

		const ssr = new SSRRenderingPipeline("ssr", this.scene)
		ssr.reflectivityThreshold = 0

		this.fallbackCamera = (() => {
			const alpha = 0
			const beta = scalar.radians.from.degrees(60)
			const radius = 2
			const target = new Vector3(0, 1.5, 0)
			return new ArcRotateCamera(
				"fallbackCamera",
				alpha, beta, radius, target,
				this.scene,
			)
		})()

		let degrees = 0

		interval(60, () => {
			if (this.scene.activeCamera === this.fallbackCamera) {
				degrees = scalar.wrap(degrees + 0.1, 0, 360)
				this.fallbackCamera.alpha = scalar.radians.from.degrees(degrees)
			}
			this.onTick.publish()
		})
	}

	start() {
		if (!this.#running) {
			this.engine.runRenderLoop(() => {
				this.onRender.publish()
				this.scene.render()
			})
			this.#running = true
		}
	}

	stop() {
		if (this.#running) {
			this.engine.stopRenderLoop()
			this.#running = false
		}
	}

	get camera() {
		return this.scene.activeCamera
	}

	setCamera(camera: Camera = this.fallbackCamera) {
		this.scene.activeCamera = camera
	}

	async load_glb(url: string) {
		const container = await SceneLoader.LoadAssetContainerAsync(
			url,
			undefined,
			this.scene,
			() => {},
			".glb",
		)

		container.removeAllFromScene()

		if (container.animationGroups.length)
			fix_animation_groups(container.animationGroups)

		return container
	}
}

