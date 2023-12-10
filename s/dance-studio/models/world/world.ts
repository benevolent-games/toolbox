
import "@babylonjs/loaders/glTF/index.js"
import "@babylonjs/core/Engines/index.js"
import "@babylonjs/core/Culling/ray.js"
import "@babylonjs/core/Rendering/edgesRenderer.js"
import "@babylonjs/core/Animations/index.js"

import {pub} from "@benev/slate"
import {Scene} from "@babylonjs/core/scene.js"
import {Engine} from "@babylonjs/core/Engines/engine.js"
import {Color4} from "@babylonjs/core/Maths/math.color.js"
import {Vector3} from "@babylonjs/core/Maths/math.vector.js"
import {HemisphericLight} from "@babylonjs/core/Lights/hemisphericLight.js"

import {Viewport} from "./utils/viewport.js"
import {CameraRig} from "./utils/camera_rig.js"
import {GridFloor} from "./utils/grid_floor.js"
import {interval} from "../../../tools/interval.js"

export class World {
	viewport = new Viewport()
	engine = new Engine(this.viewport.canvas)
	scene = new Scene(this.engine)
	cameraRig = new CameraRig(this.scene)

	onRender = pub<void>()
	onTick = pub<void>()

	constructor() {
		const {scene} = this

		scene.clearColor = new Color4(0.1, 0.1, 0.1, 1)
		new HemisphericLight("hemi", new Vector3(0.234, 1, 0.123), scene)
		new GridFloor({scene, boxSize: 0.02, extent: [7, 7], scale: 0.2})

		interval(60, () => this.onTick.publish())

		this.engine.runRenderLoop(() => {
			this.onRender.publish()
			scene.render()
		})
	}
}

