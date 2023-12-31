
import {AdjustmentAnims, Choreography} from "../types.js"
import {scalar} from "../../../../../tools/math/scalar.js"
import {calculate_adjustment_weight} from "./utils/calculate_adjustment_weight.js"
import {ChoreographerAnims} from "../anims.js"

export function synchronize_character_animations(
		choreo: Choreography,
		anims: ChoreographerAnims,
		adjustment_anims: AdjustmentAnims
	) {

	const [,vertical] = choreo.gimbal
	const {swivel, adjustment, ambulatory} = choreo

	anims.stand_unequipped_sprint_forward.weight = 1

	anims.spine_tilt_forwardsbackwards.weight = 1
	anims.spine_tilt_forwardsbackwards.forceFrame(vertical * anims.spine_tilt_forwardsbackwards.to)


	// anims.spine_tilt_forwardsbackwards.play(false)
	// anims.spine_tilt_forwardsbackwards.goToFrame(990)
	// anims.spine_tilt_forwardsbackwards.pause()

	// anims.spine_tilt_forwardsbackwards.start(true, 1, 900, 900)

	// anims.spine_tilt_forwardsbackwards.weight = 1
	// anims.spine_tilt_forwardsbackwards.goToFrame(vertical * 1000)

	// anims.legs_swivel.weight = 1
	// anims.legs_swivel.goToFrame(swivel * 1000)

	// if (adjustment)
	// 	adjustment_anims.update(adjustment)

	// const mod = function modulate_leg_weight(w: number) {
	// 	return adjustment
	// 		? scalar.cap(w - calculate_adjustment_weight(adjustment.progress))
	// 		: w
	// }

	// anims.stand_stationary.weight = ambulatory.stillness

	// anims.stand_unequipped_sprint_forward.weight = mod(ambulatory.north)
	// anims.fullbody_stand_unequipped_jog_backward.weight = mod(ambulatory.south)
	// // anims.fullbody_stand_unequipped_jog_forward.weight = mod(ambulatory.north)
	// // anims.stand_unequipped_sprint_backward.weight = mod(ambulatory.south)

	// anims.stand_unequipped_leftward.weight = mod(ambulatory.west)
	// anims.stand_unequipped_rightward.weight = mod(ambulatory.east)
}

