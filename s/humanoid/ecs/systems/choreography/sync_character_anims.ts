
import {Vec2} from "../../../../tools/math/vec2.js"
import {scalar} from "../../../../tools/math/scalar.js"
import {Ambulatory, Choreography} from "./calculations.js"
import {AdjustmentAnims} from "../../../../dance-studio/models/loader/choreographer/types.js"
import {CharacterAnims} from "../../../../dance-studio/models/loader/choreographer/parts/setup_character_anims.js"

export function sync_character_anims(
		[,vertical]: Vec2,
		choreo: Choreography,
		ambulatory: Ambulatory,
		anims: CharacterAnims,
		adjustment_anims: AdjustmentAnims
	) {

	const {swivel, adjustment} = choreo

	if (adjustment)
		adjustment_anims.update(adjustment)

	const mod = function modulate_leg_weight(w: number) {
		return adjustment
			? scalar.clamp(w - calculate_adjustment_weight(adjustment.progress))
			: w
	}

	anims.stand.weight = ambulatory.stillness
	anims.twohander.weight = ambulatory.stillness

	anims.stand_forward.weight = mod(ambulatory.north)
	anims.twohander_forward.weight = ambulatory.north

	anims.stand_backward.weight = mod(ambulatory.south)
	anims.twohander_backward.weight = ambulatory.south

	anims.stand_leftward.weight = mod(ambulatory.west)
	anims.twohander_leftward.weight = ambulatory.west

	anims.stand_rightward.weight = mod(ambulatory.east)
	anims.twohander_rightward.weight = ambulatory.east

	// additives

	anims.spine_bend.weight = 1
	anims.spine_bend.forceFrame(vertical * anims.spine_bend.to)

	anims.hips_swivel.weight = 1
	anims.hips_swivel.forceFrame(swivel * anims.hips_swivel.to)
}

////////////////////////////////////////
////////////////////////////////////////

function calculate_adjustment_weight(progress: number) {
	return scalar.spline.quickLinear(progress, [0, 1, 1, 0])
}

