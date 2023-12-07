
import "@babylonjs/loaders/glTF/index.js"
import "@babylonjs/core/Engines/index.js"
import "@babylonjs/core/Culling/ray.js"
import "@babylonjs/core/Rendering/edgesRenderer.js"

import {Scene} from "@babylonjs/core/scene.js"
import {Engine} from "@babylonjs/core/Engines/engine.js"
import {Vector3} from "@babylonjs/core/Maths/math.vector.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"
import {Color3, Color4} from "@babylonjs/core/Maths/math.color.js"
import {TargetCamera} from "@babylonjs/core/Cameras/targetCamera.js"
import {PBRMaterial} from "@babylonjs/core/Materials/PBR/pbrMaterial.js"
import {HemisphericLight} from "@babylonjs/core/Lights/hemisphericLight.js"

export class World {
	canvas = (() => {
		const canvas = document.createElement("canvas")
		canvas.width = 400
		canvas.height = 400

		new ResizeObserver(() => {
			const rect = canvas.getBoundingClientRect()
			canvas.width = rect.width
			canvas.height = rect.height
		}).observe(canvas)

		return canvas
	})()
	engine = new Engine(this.canvas)
	scene = new Scene(this.engine)

	constructor() {
		const {scene} = this
		const camera = new TargetCamera(
			"cam1",
			Vector3.Zero(),
			this.scene,
		)

		const gray = 10 / 100
		scene.clearColor = new Color4(gray, gray, gray, 1)
		scene.addCamera(camera)

		const box = MeshBuilder.CreateBox("box", {size: 1}, scene)
		box.position = new Vector3(0, 3, 3)
		const material = new PBRMaterial("mat", scene)
		material.albedoColor = new Color3(0.9, 0.9, 0.9)
		material.roughness = 0.5
		material.metallic = 0.5
		scene.addMesh(box)

		const light = new HemisphericLight("hemi", new Vector3(0.234, 1, 0.123), scene)
		scene.addLight(light)

		camera.setTarget(box.position)

		this.engine.runRenderLoop(() => {
			scene.render()
		})
	}
}

