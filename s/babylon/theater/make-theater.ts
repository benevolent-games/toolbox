
import {Scene} from "@babylonjs/core/scene.js"
import {Engine} from "@babylonjs/core/Engines/engine.js"
import {Color4} from "@babylonjs/core/Maths/math.color.js"
import {makeElement} from "./element.js"

export type Theater = ReturnType<typeof makeTheater>

export function makeTheater() {
	const canvas = document.createElement("canvas")
	canvas.className = "theater"

	const engine = new Engine(canvas, true)

	const scene = new Scene(engine, {
		useGeometryUniqueIdsMap: true,
		useMaterialMeshMap: true,
	})

	scene.clearColor = new Color4(62 / 255, 129 / 255, 186 / 255, 1)
	;(<any>window).engine = engine

	const renderLoop = new Set<() => void>()

	const element = makeElement(canvas)

	return {
		scene,
		engine,
		element,
		renderLoop,
		onresize() {
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
