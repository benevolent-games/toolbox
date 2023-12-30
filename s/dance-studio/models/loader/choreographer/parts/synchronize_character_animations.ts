
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

	anims.spine.weight = 1
	anims.spine.goToFrame(vertical * 1000)

	anims.swivel.weight = 1
	anims.swivel.goToFrame(swivel * 1000)

	if (adjustment)
		adjustment_anims.update(adjustment)

	const mod = function modulate_leg_weight(w: number) {
		return adjustment
			? scalar.cap(w - calculate_adjustment_weight(adjustment.progress))
			: w
	}

	anims.legs_stand_stationary.weight = mod(ambulatory.stillness)
	anims.legs_stand_forward.weight = mod(ambulatory.north)
	anims.legs_stand_backward.weight = mod(ambulatory.south)
	anims.legs_stand_leftward.weight = mod(ambulatory.west)
	anims.legs_stand_rightward.weight = mod(ambulatory.east)

	anims.arms_stand_unequipped_stationary.weight = ambulatory.stillness
	anims.arms_stand_unequipped_forward.weight = ambulatory.north
	anims.arms_stand_unequipped_backward.weight = ambulatory.south
	anims.arms_stand_unequipped_leftward.weight = ambulatory.west
	anims.arms_stand_unequipped_rightward.weight = ambulatory.east
}

