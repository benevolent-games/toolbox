
import {AdjustmentAnims, Choreography} from "../types.js"
import {CharacterAnims} from "./setup_character_anims.js"
import {scalar} from "../../../../../tools/math/scalar.js"
import {calculate_adjustment_weight} from "./utils/calculate_adjustment_weight.js"

export function synchronize_character_animations(
		choreo: Choreography,
		anims: CharacterAnims,
		adjustment_anims: AdjustmentAnims
	) {

	const [,vertical] = choreo.gimbal
	const {swivel, adjustment, ambulatory} = choreo

	if (adjustment)
		adjustment_anims.update(adjustment)

	const mod = function modulate_leg_weight(w: number) {
		return adjustment
			? scalar.cap(w - calculate_adjustment_weight(adjustment.progress))
			: w
	}

	anims.stand.weight = ambulatory.stillness
	anims.twohander.weight = ambulatory.stillness

	anims.stand_forward.weight = mod(ambulatory.north)
	anims.twohander_forward.weight = mod(ambulatory.north)

	anims.stand_backward.weight = mod(ambulatory.south)
	anims.twohander_backward.weight = mod(ambulatory.south)

	anims.stand_leftward.weight = mod(ambulatory.west)
	anims.twohander_leftward.weight = mod(ambulatory.west)

	anims.stand_rightward.weight = mod(ambulatory.east)
	anims.twohander_rightward.weight = mod(ambulatory.east)

	// additives

	anims.spine_bend.weight = 1
	anims.spine_bend.forceFrame(vertical * anims.spine_bend.to)

	anims.hips_swivel.weight = 1
	anims.hips_swivel.forceFrame(swivel * 1000)
}

