
import {pubsub} from "@benev/slate"
import {Scene} from "@babylonjs/core/scene.js"
import {Engine} from "@babylonjs/core/Engines/engine.js"

export class Gameloop {
	readonly beforeRender = pubsub<[number]>()

	#last = performance.now()
	#running = false
	get running() { return this.#running }
	constructor(public engine: Engine, public scenes: Scene[]) {}

	toggle() {
		if (this.#running) this.stop()
		else this.start()
		return this.#running
	}

	start() {
		if (!this.#running) {
			this.#last = performance.now()
			this.engine.runRenderLoop(() => {
				const now = performance.now()
				const delta = now - this.#last
				this.#last = now

				this.beforeRender.publish(delta)

				for (const scene of this.scenes)
					scene.render()
			})
		}
	}

	stop() {
		this.engine.stopRenderLoop()
	}
}

