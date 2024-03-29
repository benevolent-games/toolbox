
import {interval, pub} from "@benev/slate"
import {Scene} from "@babylonjs/core/scene.js"
import {Engine} from "@babylonjs/core/Engines/engine.js"

export class Gameloop {
	onTick = pub<void>()
	onRender = pub<void>()

	#running = false
	#interval = () => {}

	constructor(
		private engine: Engine,
		private scene: Scene,
		public readonly tickrate_hz: number,
	) {}

	get running() {
		return this.#running
	}

	toggle() {
		if (this.#running)
			this.stop()
		else
			this.start()
		return this.#running
	}

	start() {
		if (!this.#running) {
			this.#running = true
			this.#interval = interval(this.tickrate_hz, () => this.onTick.publish())
			this.engine.runRenderLoop(() => {
				this.onRender.publish()
				this.scene.render()
			})
		}
	}

	stop() {
		if (this.#running) {
			this.#interval()
			this.engine.stopRenderLoop()
			this.#running = false
		}
	}
}

