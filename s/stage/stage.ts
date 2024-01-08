
import {Scene} from "@babylonjs/core/scene.js"
import {Color4} from "@babylonjs/core/Maths/math.js"
import {Engine} from "@babylonjs/core/Engines/engine.js"
import {AssetContainer} from "@babylonjs/core/assetContainer.js"

import {StageOptions} from "./types.js"
import {Remote} from "./parts/remote.js"
import {scalar} from "../tools/math/scalar.js"
import {Rendering} from "./parts/rendering.js"
import {backgrounds, effects} from "./standards.js"
import {PointerLocker} from "./parts/pointer_locker.js"
import {make_load_glb_fn} from "./parts/make_load_glb_fn.js"

export class Stage {
	static backgrounds = backgrounds
	static effects = effects

	engine: Engine
	scene: Scene

	remote: Remote
	rendering: Rendering
	pointerLocker: PointerLocker
	load_glb: (url: string) => Promise<AssetContainer>

	constructor({canvas, background}: StageOptions) {
		const engine = this.engine = new Engine(canvas)
		const scene = this.scene = new Scene(engine)
		scene.clearColor = new Color4(...background)

		const remote = this.remote = new Remote(engine, scene)
		const rendering = this.rendering = new Rendering(scene)
		this.load_glb = make_load_glb_fn(scene)
		this.pointerLocker = new PointerLocker(canvas)

		remote.onTick(() => {
			if (rendering.camera === rendering.fallbackCamera) {
				rendering.fallbackCamera.alpha = scalar.wrap(
					rendering.fallbackCamera.alpha + scalar.radians.from.degrees(0.1),
					0,
					scalar.radians.from.circle(1),
				)
			}
		})
	}
}

