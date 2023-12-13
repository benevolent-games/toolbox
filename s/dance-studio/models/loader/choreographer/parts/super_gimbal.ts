
import {Gimbal} from "./gimbal.js"
import {Vec2} from "../../../../../tools/math/vec2.js"
import {scalar} from "../../../../../tools/math/scalar.js"
import {AdjustmentAnimations, AdjustmentSequence} from "./utils/adjustment_sequence.js"

const swivel_target = 0.5

type SuperGimbalParams = {
	swivel_duration: number
	sensitivity: number
	swivel_readjustment_margin: number
}

export class SuperGimbal {
	#params: SuperGimbalParams
	#gimbal: Gimbal
	#adjustment: AdjustmentSequence | null = null

	constructor(params: SuperGimbalParams) {
		this.#params = params
		this.#gimbal = new Gimbal(params)
	}

	get spine() { return this.#gimbal.spine }
	get capsule() { return this.#gimbal.capsule }
	get swivel() { return this.#gimbal.swivel }

	update({look, character_is_ambulating, adjustment_animations}: {
			look: Vec2
			character_is_ambulating: boolean
			adjustment_animations: AdjustmentAnimations
		}) {

		const {swivel_readjustment_margin} = this.#params
		const gimbal = this.#gimbal

		gimbal.update(look)

		const requires_swivel_adjustment = !scalar.within(
			gimbal.swivel,
			swivel_readjustment_margin,
			1 - swivel_readjustment_margin,
		)

		if (!this.#adjustment && requires_swivel_adjustment) {
			this.#adjustment = new AdjustmentSequence({
				swivel_target,
				swivel_initial: gimbal.swivel,
				swivel_duration: this.#params.swivel_duration,
			})

			adjustment_animations.start(this.#adjustment)
		}

		{
			const adjustment = this.#adjustment

			if (adjustment) {
				adjustment.update()
				adjustment_animations.update(adjustment)
				gimbal.swivel = adjustment.swivel

				if (adjustment.done) {
					adjustment_animations.stop(adjustment)
					this.#adjustment = null
				}
			}
		}

		if (!this.#adjustment && character_is_ambulating) {
			const swivelMiddle = 0.5
			const diff = swivelMiddle - gimbal.swivel
			const swivel_span = swivel_target - swivel_readjustment_margin
			const speed = swivel_span / this.#params.swivel_duration

			if (Math.abs(diff) <= speed)
				gimbal.swivel = 0.5
			else
				gimbal.swivel += (diff < 0)
					? -speed
					: speed
		}
	}

	modulate_leg_weight(w: number) {
		return this.#adjustment
			? scalar.cap(w - this.#adjustment.weight)
			: w
	}
}

