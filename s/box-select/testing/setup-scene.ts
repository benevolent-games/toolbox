
import {Scene} from "@babylonjs/core/scene.js"
import {Engine} from "@babylonjs/core/Engines/engine.js"

export function setupScene() {
	const canvas = document.createElement("canvas")
	const engine = new Engine(canvas)
	return new Scene(engine)
}
