
import {AnimLibrary} from "./utils/types.js"
import {activate_animations} from "./utils/activate_animations.js"

export function configure_animation(anims: AnimLibrary) {
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

