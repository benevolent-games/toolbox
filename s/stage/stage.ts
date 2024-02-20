
import {Scene} from "@babylonjs/core/scene.js"
import {Color4} from "@babylonjs/core/Maths/math.js"
import {Engine} from "@babylonjs/core/Engines/engine.js"
import {AssetContainer} from "@babylonjs/core/assetContainer.js"

import {Vec4} from "../math/vec4.js"
import {StageOptions} from "./types.js"
import {Gameloop} from "./parts/gameloop.js"
import {Porthole} from "./parts/porthole.js"
import {load_glb} from "./utils/load_glb.js"
import {radians, wrap} from "../math/scalar.js"
import {Rendering} from "./rendering/rendering.js"
import {PointerLocker} from "./parts/pointer_locker.js"

export class Stage {
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

	#last_tick_time: number
	#tick_counter: number = 0
	#tick_rate: number = 0

	get measured_tick_rate() {
		return this.#tick_rate
	}

	constructor({background, tickrate_hz}: StageOptions) {
		const porthole = this.porthole = new Porthole()
		const engine = this.engine = new Engine(porthole.canvas)
		const scene = this.scene = new Scene(engine)
		scene.clearColor = new Color4(...background)

		const gameloop = this.gameloop = new Gameloop(engine, scene, tickrate_hz)
		const rendering = this.rendering = new Rendering(scene)
		this.pointerLocker = new PointerLocker(porthole.canvas)
		this.load_glb = async(url: string) => load_glb(scene, url)

		this.#last_tick_time = performance.now()

		gameloop.onTick(() => {
			this.#tick_counter++
			const currentTime = performance.now()

			if (currentTime - this.#last_tick_time >= 1000) {
				this.#tick_rate = this.#tick_counter
				this.#tick_counter = 0
				this.#last_tick_time = currentTime
			}

			if (rendering.camera === rendering.fallbackCamera) {
				rendering.fallbackCamera.alpha = wrap(
					rendering.fallbackCamera.alpha + radians.from.degrees(0.1),
					0,
					radians.from.circle(1),
				)
			}
		})
	}
}

