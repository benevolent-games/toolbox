
import {pub} from "@benev/slate"
import {Scene} from "@babylonjs/core/scene.js"
import {Color4} from "@babylonjs/core/Maths/math.js"
import {Engine} from "@babylonjs/core/Engines/engine.js"
import {AssetContainer} from "@babylonjs/core/assetContainer.js"

import {Cam} from "./parts/cam.js"
import {StageOptions} from "./types.js"
import {Remote} from "./parts/remote.js"
import {scalar} from "../tools/math/scalar.js"
import {Rendering} from "./parts/rendering.js"
import {colors, effects} from "./standards.js"
import {make_load_glb_fn} from "./parts/make_load_glb_fn.js"

export class Stage {
	static colors = colors
	static effects = effects

	engine: Engine
	scene: Scene

	cam: Cam
	remote: Remote
	rendering: Rendering
	load_glb: (url: string) => Promise<AssetContainer>

	onTick = pub<void>()
	onRender = pub<void>()

	constructor({canvas, background, effects}: StageOptions) {
		const {onTick, onRender} = this

		const engine = this.engine = new Engine(canvas)
		const scene = this.scene = new Scene(engine)
		scene.clearColor = new Color4(...background)

		const rendering = this.rendering = new Rendering({scene, effects})
		const cam = this.cam = new Cam(scene, rendering)
		this.load_glb = make_load_glb_fn(scene)
		this.remote = new Remote(engine, scene, onTick, onRender)

		onTick(() => {
			if (cam.current === cam.fallback) {
				cam.fallback.alpha = scalar.wrap(
					cam.fallback.alpha + scalar.radians.from.degrees(0.1),
					0,
					scalar.radians.from.circle(1),
				)
			}
		})
	}
}

