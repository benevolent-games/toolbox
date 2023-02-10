
import "@babylonjs/core/Engines/Extensions/engine.query.js"
import "@babylonjs/core/Rendering/depthRendererSceneComponent.js"

import {DepthRenderer} from "@babylonjs/core/Rendering/depthRenderer.js"
import {Scene} from "@babylonjs/core/scene.js"
import {Engine} from "@babylonjs/core/Engines/engine.js"
import {Color4} from "@babylonjs/core/Maths/math.color.js"
import {SceneInstrumentation} from "@babylonjs/core/Instrumentation/sceneInstrumentation.js"
import {EngineInstrumentation} from "@babylonjs/core/Instrumentation/engineInstrumentation.js"

import {BabylonWorld} from "../types/babylon-world.js"

export function makeBabylonWorld(): BabylonWorld {
	const canvas = document.createElement("canvas")
	const engine = new Engine(canvas, true)
	const scene = new Scene(engine, {
		useGeometryUniqueIdsMap: true,
		useMaterialMeshMap: true,
	})
	const renderer = new DepthRenderer(scene)
	renderer.enabled = true
	scene.clearColor = new Color4(62 / 255, 129 / 255, 186 / 255, 1)

	const renderLoop = new Set<() => void>()

	const engineInstrumentation = new EngineInstrumentation(engine)
	const sceneInstrumentation = new SceneInstrumentation(scene)

	engineInstrumentation.captureGPUFrameTime = true
	engineInstrumentation.captureShaderCompilationTime = true

	sceneInstrumentation.captureFrameTime = true
	sceneInstrumentation.captureRenderTime = true
	sceneInstrumentation.capturePhysicsTime = true
	sceneInstrumentation.captureInterFrameTime = true
	sceneInstrumentation.captureCameraRenderTime = true
	sceneInstrumentation.captureActiveMeshesEvaluationTime = true
	
	; (<any>window).engine = engine

	return {
		canvas,
		engine,
		scene,
		renderLoop,
		sceneInstrumentation,
		engineInstrumentation,
		resize() {
			const {width, height} = canvas.getBoundingClientRect()
			canvas.width = width
			canvas.height = height
			engine.resize()
		},
		start() {
			engine.runRenderLoop(() => {
				for (const routine of renderLoop)
					routine()
				scene.render()
			})
		},
		stop() {
			engine.stopRenderLoop()
		},
	}
}
