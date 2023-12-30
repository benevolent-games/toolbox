
import {CharacterAnims} from "../../character/types.js"
import {AdjustmentAnims, Choreography} from "../types.js"
import {scalar} from "../../../../../tools/math/scalar.js"
import {calculate_adjustment_weight} from "./utils/calculate_adjustment_weight.js"

export function synchronize_character_animations(
		choreo: Choreography,
		anims: CharacterAnims,
		adjustment_anims: AdjustmentAnims
	) {

	const [,vertical] = choreo.gimbal
	const {swivel, adjustment, ambulatory} = choreo

	// anims.spine_tilt_forwardsbackwards.weight = 1
	// anims.spine_tilt_forwardsbackwards.goToFrame(vertical * 1000)

	anims.spine_swivel.weight = 1
	anims.spine_swivel.goToFrame(1000 - (swivel * 1000))

	if (adjustment)
		adjustment_anims.update(adjustment)

	const mod = function modulate_leg_weight(w: number) {
		return adjustment
			? scalar.cap(w - calculate_adjustment_weight(adjustment.progress))
			: w
	}

	// anims.stand_stationary.weight = ambulatory.stillness

	// anims.stand_unequipped_sprint_forward.weight = mod(ambulatory.north)
	// // anims.stand_unequipped_sprint_backward.weight = mod(ambulatory.south)

	// // anims.fullbody_stand_unequipped_jog_forward.weight = mod(ambulatory.north)
	// anims.fullbody_stand_unequipped_jog_backward.weight = mod(ambulatory.south)

	// anims.stand_unequipped_leftward.weight = mod(ambulatory.west)
	// anims.stand_unequipped_rightward.weight = mod(ambulatory.east)












	// anims.arms_stand_unequipped_stationary.weight = ambulatory.stillness
	// anims.arms_stand_unequipped_forward.weight = ambulatory.north
	// anims.arms_stand_unequipped_backward.weight = ambulatory.south
	// anims.arms_stand_unequipped_leftward.weight = ambulatory.west
	// anims.arms_stand_unequipped_rightward.weight = ambulatory.east
}

