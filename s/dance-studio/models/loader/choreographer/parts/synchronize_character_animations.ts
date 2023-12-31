
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

	anims.stand_stationary.weight = ambulatory.stillness
	anims.stand_unequipped_sprint_forward.weight = mod(ambulatory.north)
	anims.fullbody_stand_unequipped_jog_backward.weight = mod(ambulatory.south)
	anims.stand_unequipped_leftward.weight = mod(ambulatory.west)
	anims.stand_unequipped_rightward.weight = mod(ambulatory.east)

	// additives

	anims.spine_tilt_forwardsbackwards.weight = 1
	anims.spine_tilt_forwardsbackwards.forceFrame(vertical * anims.spine_tilt_forwardsbackwards.to)

	anims.legs_swivel.weight = 1
	anims.legs_swivel.forceFrame(swivel * 1000)
}

