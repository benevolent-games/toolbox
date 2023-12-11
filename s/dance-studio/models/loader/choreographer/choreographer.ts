
import {Pojo} from "@benev/slate"
import {AnimationGroup} from "@babylonjs/core/Animations/animationGroup.js"

import {Molasses} from "./utils/molasses.js"
import {AnimLibrary} from "./utils/types.js"
import {Vec2, vec2} from "../../../../tools/math/vec2.js"
import {scalar} from "../../../../tools/math/scalar.js"
import {activate_animations} from "./utils/active_animations.js"
import {process_animation_groups} from "./utils/process_animation_groups.js"

// function configure_animation(anims: AnimLibrary) {
// 	return activate_animations(anims, [
// 		["idle", "weighted_looper"],

// 		["legs_running", "weighted_looper"],
// 		["legs_strafeleft", "weighted_looper"],
// 		["legs_straferight", "weighted_looper"],
// 		["runningbackwards", "weighted_looper"],

// 		["arms_running", "weighted_looper"],
// 		["arms_strafeleft", "weighted_looper"],
// 		["arms_straferight", "weighted_looper"],
// 	])
// }

function configure_animation(anims: AnimLibrary) {
	return activate_animations(anims, [
		["spine", "primary"],

		["swivel", "primary"],
		["legs_stand_adjust_left", "weighted_looper"],
		["legs_stand_adjust_right", "weighted_looper"],

		["legs_stand_stationary", "weighted_looper"],
		["legs_stand_forward", "weighted_looper"],
		["legs_stand_backward", "weighted_looper"],
		["legs_stand_leftward", "weighted_looper"],
		["legs_stand_rightward", "weighted_looper"],

		["arms_stand_unequipped_stationary", "weighted_looper"],
		["arms_stand_unequipped_forward", "weighted_looper"],
		["arms_stand_unequipped_backward", "weighted_looper"],
		["arms_stand_unequipped_leftward", "weighted_looper"],
		["arms_stand_unequipped_rightward", "weighted_looper"],
	])
}

export class Choreographer {
	all_animations: Pojo<AnimationGroup>
	anims: ReturnType<typeof configure_animation>

	constructor(animationGroups: AnimationGroup[]) {
		this.all_animations = process_animation_groups(animationGroups)
		this.anims = configure_animation(this.all_animations)
	}

	#ambulation_weights = new Molasses(0.1)

	tick(inputs: {
			ambulate: Vec2
		}) {

		const {anims} = this
		const ambulate = this.#ambulation_weights.update(inputs.ambulate)

		{
			const stillness = scalar.cap(1 - vec2.magnitude(ambulate), 0, 1)
			const [x, y] = ambulate
			const w = scalar.cap(y, 0, 1)
			const a = -scalar.cap(x, -1, 0)
			const s = -scalar.cap(y, -1, 0)
			const d = scalar.cap(x, 0, 1)

			// spine and swivel
			this.#apply_weights(
				[anims.spine, 1.0],
				[anims.swivel, 1.0],
			)

			// legs
			this.#apply_weights(
				[anims.legs_stand_stationary, stillness],
				[anims.legs_stand_forward, w],
				[anims.legs_stand_backward, s],
				[anims.legs_stand_leftward, a],
				[anims.legs_stand_rightward, d],
			)

			// arms
			this.#apply_weights(
				[anims.arms_stand_unequipped_stationary, stillness],
				[anims.arms_stand_unequipped_forward, w],
				[anims.arms_stand_unequipped_backward, s],
				[anims.arms_stand_unequipped_leftward, a],
				[anims.arms_stand_unequipped_rightward, d],
			)

			// this.#apply_weights(
			// 	[anims.idle, idleness],

			// 	[anims.legs_running, w],
			// 	[anims.arms_running, w],

			// 	[anims.runningbackwards, s],

			// 	[anims.legs_strafeleft, a],
			// 	[anims.arms_strafeleft, a],

			// 	[anims.legs_straferight, d],
			// 	[anims.arms_straferight, d],
			// )
		}

	}

	#apply_weights(
			...applications: [AnimationGroup | undefined, weight: number][]
		) {
		for (const [anim, weight] of applications)
			if (anim)
				anim.weight = weight
	}
}

