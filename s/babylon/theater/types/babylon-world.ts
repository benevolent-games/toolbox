
import {Scene} from "@babylonjs/core/scene.js"
import {Engine} from "@babylonjs/core/Engines/engine.js"
import {SceneInstrumentation} from "@babylonjs/core/Instrumentation/sceneInstrumentation.js"
import {EngineInstrumentation} from "@babylonjs/core/Instrumentation/engineInstrumentation.js"

export type BabylonWorld = {
	canvas: HTMLCanvasElement
	engine: Engine
	scene: Scene
	sceneInstrumentation: SceneInstrumentation
	engineInstrumentation: EngineInstrumentation

	renderLoop: Set<() => void>
	resize(res: number): void
	start(): void
	stop(): void
}
