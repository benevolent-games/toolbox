
import {Pub, interval} from "@benev/slate"
import {Scene} from "@babylonjs/core/scene.js"
import {Engine} from "@babylonjs/core/Engines/engine.js"

export class Remote {
	#running = false
	#interval = () => {}

	constructor(
		private engine: Engine,
		private scene: Scene,
		private onTick: Pub<void>,
		private onRender: Pub<void>,
	) {}

	get running() {
		return this.#running
	}

	toggle() {
		if (this.#running)
			this.stop()
		else
			this.start()
	}

	start() {
		if (!this.#running) {
			this.#running = true
			this.#interval = interval(60, () => this.onTick.publish())
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

