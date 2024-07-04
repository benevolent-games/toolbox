
import {debounce} from "@benev/slate/x/tools/debounce/debounce.js"

/** use a resize observer to maintain the given resolution ratio for the size of the canvas */
export class CanvasScaler {
	static make = (canvas = document.createElement("canvas")) => new this(canvas)

	#resolution = 1

	constructor(public readonly canvas = document.createElement("canvas")) {
		canvas.width = 400
		canvas.height = 400
		new ResizeObserver(() => this.#recompute_resolution_for_size())
			.observe(canvas)
	}

	get resolution() {
		return this.#resolution
	}

	set resolution(r: number) {
		this.#resolution = r
		this.#recompute_resolution_for_size()
	}

	#recompute_resolution_for_size = debounce(100, () => {
		const {canvas} = this
		const rect = canvas.getBoundingClientRect()
		canvas.width = rect.width * this.#resolution
		canvas.height = rect.height * this.#resolution
	})
}

