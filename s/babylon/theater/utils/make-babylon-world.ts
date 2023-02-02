
import {Scene} from "@babylonjs/core/scene.js"
import {Engine} from "@babylonjs/core/Engines/engine.js"
import {Color4} from "@babylonjs/core/Maths/math.color.js"

import {BabylonWorld} from "../types/babylon-world.js"

export function makeBabylonWorld(): BabylonWorld {
	const canvas = document.createElement("canvas")
	const engine = new Engine(canvas, true)
	const scene = new Scene(engine, {
		useGeometryUniqueIdsMap: true,
		useMaterialMeshMap: true,
	})

	scene.clearColor = new Color4(62 / 255, 129 / 255, 186 / 255, 1)

	const renderLoop = new Set<() => void>()

	return {
		canvas,
		engine,
		scene,
		renderLoop,
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
