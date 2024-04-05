import {pub} from "@benev/slate"
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

	maximumFps = 250;
	lastTick = performance.now();
	lastRender = performance.now();

	beforeRenderLoop = () => {
		// Camera movement and anything here right before scene render
		this.onRender.publish();
		// Tick functions here
		this.onTick.publish();
	}

	runTick = () => {
		const tickDeltaTime = performance.now() - this.lastTick;
		if (tickDeltaTime >= (1000 / 70)) {
			// Reset lastTick
			this.lastTick = performance.now();
		}
	}

	renderFrame = () => {
		const renderDeltaTime = performance.now() - this.lastRender;
		if (renderDeltaTime >= (1000 / this.maximumFps)) {
			// Render babylonjs
			this.engine.beginFrame();
			this.scene.render();
			this.engine.endFrame();

			// Reset lastRender
			this.lastRender = performance.now();
		}
	}

	renderLoop = () => {
		this.runTick();
		this.renderFrame();
		requestAnimationFrame(this.renderLoop);
	}

	start() {
		if (!this.#running) {
			this.#running = true
			requestAnimationFrame(this.renderLoop);
			this.scene.registerBeforeRender(this.beforeRenderLoop);
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

