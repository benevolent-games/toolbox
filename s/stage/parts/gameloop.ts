
import {pub} from "@benev/slate"
import {Scene} from "@babylonjs/core/scene.js"
import {Engine} from "@babylonjs/core/Engines/engine.js"

import {id_counter} from "../../tools/id.js"

export class Gameloop {
	id = id_counter()
	onTick = pub<void>()

	#max_delta: number
	#last_render = performance.now()
	#running: null | {id: number, cleanup: () => void} = null

	get running() {
		return !!this.#running
	}

	constructor(
			private engine: Engine,
			private scene: Scene,
			public readonly tickrate_hz: number,
			public readonly maximum_hz: number,
		) {
		this.#max_delta = 1000 / maximum_hz
	}

	toggle() {
		if (this.#running) this.stop()
		else this.start()
		return this.running
	}

	start() {
		if (!this.#running) {
			const id = this.id()
			this.#last_render = performance.now()

			const loop = () => {
				if (this.#running?.id === id) {
					const delta = performance.now() - this.#last_render
					if (delta >= this.#max_delta) {
						this.engine.beginFrame()
						this.scene.render()
						this.engine.endFrame()
						this.#last_render = performance.now()
					}
					requestAnimationFrame(loop)
				}
			}

			const beforeRender = () => this.onTick.publish()
			this.scene.registerBeforeRender(beforeRender)
			this.#running = {
				id,
				cleanup: () => this.scene.unregisterBeforeRender(beforeRender),
			}

			loop()
		}
	}

	stop() {
		if (this.#running) {
			this.#running.cleanup()
			this.#running = null
		}
	}
}

