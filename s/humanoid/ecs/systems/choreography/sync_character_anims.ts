
import {AnimationGroup} from "@babylonjs/core/Animations/animationGroup.js"

import {Vec2} from "../../../../tools/math/vec2.js"
import {scalar} from "../../../../tools/math/scalar.js"
import {Ambulatory, Choreography} from "./calculations.js"
import {AdjustmentAnims} from "../../../../dance-studio/models/loader/choreographer/types.js"
import {CharacterAnims} from "../../../../dance-studio/models/loader/choreographer/parts/setup_character_anims.js"
import { human } from "../../../../tools/human.js"

export function sync_character_anims({
		gimbal: [,vertical],
		anims,
		choreo,
		ambulatory,
		boss_anim,
		adjustment_anims,
		anim_speed_modifier,

	}: {
		gimbal: Vec2
		choreo: Choreography
		ambulatory: Ambulatory
		anims: CharacterAnims
		boss_anim: AnimationGroup
		anim_speed_modifier: number
		adjustment_anims: AdjustmentAnims
	}) {

	const {swivel, adjustment} = choreo

	if (adjustment)
		adjustment_anims.update(adjustment)

	function setSpeed(s: number) {
		boss_anim.speedRatio = s * anim_speed_modifier
	}

	const mod = function modulate_leg_weight(w: number) {
		return adjustment
			? scalar.clamp(w - calculate_adjustment_weight(adjustment.progress))
			: w
	}

	const b = (w: number) => scalar.spline.quickLinear(scalar.clamp(w), [
		0,
		.9,
		1,
	])

	const sprint = scalar.clamp(ambulatory.north - 1)
	const noSprint = 1 - sprint

	setSpeed(ambulatory.magnitude)

	anims.stand.weight = ambulatory.stillness
	anims.twohander.weight = ambulatory.stillness

	anims.stand_forward.weight = noSprint * b(mod(ambulatory.north))
	anims.stand_sprint.weight = sprint * b(mod(ambulatory.north))
	anims.twohander_forward.weight = b(ambulatory.north)

	anims.stand_backward.weight = b(mod(ambulatory.south))
	anims.twohander_backward.weight = b(ambulatory.south)

	anims.stand_leftward.weight = b(mod(ambulatory.west))
	anims.twohander_leftward.weight = b(ambulatory.west)

	anims.stand_rightward.weight = b(mod(ambulatory.east))
	anims.twohander_rightward.weight = b(ambulatory.east)

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

