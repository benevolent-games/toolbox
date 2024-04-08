
import {Scene} from "@babylonjs/core/scene.js"
import {Color4} from "@babylonjs/core/Maths/math.js"
import {Engine} from "@babylonjs/core/Engines/engine.js"
import {AssetContainer} from "@babylonjs/core/assetContainer.js"
import {CompatibilityOptions} from "@babylonjs/core/Compat/compatibilityOptions.js"

import {Vec4} from "../math/vec4.js"
import {Gameloop} from "./parts/gameloop.js"
import {Porthole} from "./parts/porthole.js"
import {load_glb} from "./utils/load_glb.js"
import {radians, wrap} from "../math/scalar.js"
import {Rendering} from "./rendering/rendering.js"
import {PointerLocker} from "./parts/pointer_locker.js"
import {CreateStageOptions, StageOptions} from "./types.js"
import {create_webgl_or_webgpu_engine} from "../tools/create_webgl_or_webgpu_engine.js"

export class Stage {

	static async create(options: CreateStageOptions) {
		const porthole = new Porthole()
		const engine = await create_webgl_or_webgpu_engine({
			...options,
			canvas: porthole.canvas,
		})
		const scene = new Scene(engine)
		return new Stage({porthole, engine, scene, ...options})
	}

	static backgrounds = {
		transparent: () => [0, 0, 0, 0] as Vec4,
		black: () => [0, 0, 0, 1] as Vec4,
		white: () => [1, 1, 1, 1] as Vec4,
		gray: () => [.1, .1, .1, 1] as Vec4,
		sky: () => [.7, .8, 1, 1] as Vec4,
	}

	porthole: Porthole
	engine: Engine
	scene: Scene

	gameloop: Gameloop
	rendering: Rendering
	pointerLocker: PointerLocker
	load_glb: (url: string) => Promise<AssetContainer>

	constructor({porthole, engine, scene, background}: StageOptions) {
		this.porthole = porthole
		this.engine = engine
		this.scene = scene

		scene.clearColor = new Color4(...background)

		// we roll with opengl and gltf standards
		scene.useRightHandedSystem = true
		CompatibilityOptions.UseOpenGLOrientationForUV = true

		const gameloop = this.gameloop = new Gameloop(engine, [scene])
		this.rendering = new Rendering(scene)
		this.pointerLocker = new PointerLocker(porthole.canvas)
		this.load_glb = async(url: string) => load_glb(scene, url)

		gameloop.on(() => this.#rotate_fallback_camera())
	}

	#rotate_fallback_camera() {
		const {rendering} = this
		if (rendering.camera === rendering.fallbackCamera) {
			rendering.fallbackCamera.alpha = wrap(
				rendering.fallbackCamera.alpha + radians.from.degrees(0.1),
				0,
				radians.circle,
			)
		}
	}
}

