
import {debounce} from "@benev/slate"

export class Porthole {
	#resolution = 0.25
	readonly canvas = document.createElement("canvas")

	constructor() {
		const {canvas} = this
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

