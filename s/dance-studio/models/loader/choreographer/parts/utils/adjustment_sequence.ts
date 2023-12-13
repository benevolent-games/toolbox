
import {scalar} from "../../../../../../tools/math/scalar.js"

export type AdjustmentDirection = "left" | "right"

export type AdjustmentAnimations = {
	start: (adjustment: AdjustmentSequence) => void
	stop: (adjustment: AdjustmentSequence) => void
	update: (adjustment: AdjustmentSequence) => void
}

export type AdjustmentParams = {
	swivel_duration: number
	swivel_initial: number
	swivel_target: number
}

export class AdjustmentSequence {
	#params: AdjustmentParams
	#progress = 0
	#speed: number

	constructor(params: AdjustmentParams) {
		this.#params = params
		this.#speed = 1 / params.swivel_duration
	}

	get direction() {
		return this.#params.swivel_initial < 0.5
			? "left"
			: "right"
	}

	get progress() {
		return this.#progress
	}

	get done() {
		return this.#progress >= 1
	}

	get swivel() {
		return scalar.map(this.#progress, [
			this.#params.swivel_initial,
			this.#params.swivel_target,
		])
	}

	get weight() {
		return scalar.spline.quickLinear(
			this.#progress,
			[0, 1, 1, 0],
		)
	}

	update() {
		this.#progress += this.#speed
	}
}

