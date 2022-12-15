
import {Suite, expect} from "cynic"

import {Scene} from "@babylonjs/core/scene.js"
import {Engine} from "@babylonjs/core/Engines/engine.js"
import {Vector3, Vector2} from "@babylonjs/core/Maths/math.js"
import {ArcRotateCamera} from "@babylonjs/core/Cameras/arcRotateCamera.js"

import {boxSelect} from "./box-select.js"

export default <Suite>{

	async "select a point"() {
		const canvas = document.createElement("canvas")
		const engine = new Engine(canvas)
		const scene = new Scene(engine)
		const alpha = 0
		const beta = 0
		const radius = 10
		const target = Vector3.Zero()
		const camera = new ArcRotateCamera("cam", alpha, beta, radius, target, scene)

		const selected = boxSelect({
			groups: [
				{
					boundingBox: {
						start: new Vector3(-0.5, -0.5, -0.5),
						end: new Vector3(0.5, 0.5, 0.5),
					},
					points: [
						new Vector3(1, 2, 3),
					],
				}
			],

			// TODO figure out the correct matrix
			projection: camera.getProjectionMatrix(),

			box: {
				start: new Vector2(-1, -1),
				end: new Vector2(1, 1),
			},
		})

		expect(selected).equals(1)
	},
}
