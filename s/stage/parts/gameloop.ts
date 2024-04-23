
import {pubsub} from "@benev/slate"
import {Scene} from "@babylonjs/core/scene.js"

import {BabylonEngine} from "../types.js"
import {DeltaTimer} from "../../tools/delta_timer.js"

export class Gameloop {
	readonly on = pubsub<[number]>()
	delta = new DeltaTimer({min_hertz: 10, max_hertz: 300})

	#starters: (() => () => void)[] = []
	#stoppers: (() => void)[] = []

	get running() {
		return this.#stoppers.length > 0
	}

	constructor(public engine: BabylonEngine, public scenes: Scene[]) {
		this.register(() => {
			const fn = () => {
				const ms = this.delta.measure()
				this.on.publish(ms)
				for (const scene of this.scenes)
					scene.render()
			}
			engine.runRenderLoop(fn)
			return () => engine.stopRenderLoop(fn)
		})
	}

	register(fn: () => () => void) {
		this.#starters.push(fn)
	}

	toggle() {
		if (this.running) this.stop()
		else this.start()
		return this.running
	}

	start() {
		if (!this.running) {
			this.delta.measure()
			for (const start of this.#starters)
				this.#stoppers.push(start())
		}
	}

	stop() {
		this.#stoppers.forEach(stop => stop())
		this.#stoppers = []
	}
}

