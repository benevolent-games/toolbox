
import {AnimBlueprint} from "./types.js"

export const anim_blueprint = [

	["spine_tilt_forwardsbackwards", "primary"],
	["spine_swivel", "primary"],

	["legs_stand_adjust_left", "primary"],
	["legs_stand_adjust_right", "primary"],

	["stand_stationary", "weighted_looper"],
	["stand_unequipped_sprint_forward", "weighted_looper"],
	["stand_unequipped_sprint_backward", "weighted_looper"],
	["fullbody_stand_unequipped_jog_forward", "weighted_looper"],
	["fullbody_stand_unequipped_jog_backward", "weighted_looper"],
	["stand_unequipped_leftward", "weighted_looper"],
	["stand_unequipped_rightward", "weighted_looper"],

	// ["spine", "primary"],

	// ["swivel", "primary"],
	// ["legs_stand_adjust_left", "primary"],
	// ["legs_stand_adjust_right", "primary"],

	// ["legs_stand_stationary", "weighted_looper"],
	// ["legs_stand_forward", "weighted_looper"],
	// ["legs_stand_backward", "weighted_looper"],
	// ["legs_stand_leftward", "weighted_looper"],
	// ["legs_stand_rightward", "weighted_looper"],

	// ["arms_stand_unequipped_stationary", "weighted_looper"],
	// ["arms_stand_unequipped_forward", "weighted_looper"],
	// ["arms_stand_unequipped_backward", "weighted_looper"],
	// ["arms_stand_unequipped_leftward", "weighted_looper"],
	// ["arms_stand_unequipped_rightward", "weighted_looper"],
] as const satisfies AnimBlueprint<string>

