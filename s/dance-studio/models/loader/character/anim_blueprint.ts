
import {AnimBlueprint} from "./types.js"

export const anim_blueprint = [
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
] as const satisfies AnimBlueprint<string>

