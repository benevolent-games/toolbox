
import {Suite, expect} from "cynic"

import "@babylonjs/core/Materials/standardMaterial.js"

import {boxSelect} from "./box-select.js"
import {setupScene} from "./box-select/testing/setup-scene.js"
import {fullscreenBox} from "./box-select/testing/fullscreen-box.js"
import {cubeNearOrigin} from "./box-select/testing/cube-near-origin.js"
import {arcCameraLookingAtOrigin} from "./box-select/testing/arc-camera-looking-at-origin.js"

export default <Suite>{

	async "select a point"() {
		const scene = setupScene()
		arcCameraLookingAtOrigin(scene)
		const cube = cubeNearOrigin(scene)

		scene.updateTransformMatrix(true)

		const selected = boxSelect({
			points: [cube.position],
			transform: scene.getTransformMatrix(),
			box: fullscreenBox(),
		})

		expect(selected.length).equals(1)
	},
}
