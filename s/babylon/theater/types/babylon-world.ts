
import {Scene} from "@babylonjs/core/scene.js"
import {Engine} from "@babylonjs/core/Engines/engine.js"

export type BabylonWorld = {
	canvas: HTMLCanvasElement
	engine: Engine
	scene: Scene

	renderLoop: Set<() => void>
	resize(): void
	start(): void
	stop(): void
}
