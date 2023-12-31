
// import {AnimBlueprint} from "./types.js"

import {asAnimationBlueprint} from "./types.js";

export const anim_blueprint = asAnimationBlueprint([
	"stand_stationary",
	"stand_unequipped_sprint_forward",
	"spine_tilt_forwardsbackwards",
])

// export const anim_blueprint = [
// 	["stand_stationary", "base_loop"],
// 	["stand_unequipped_sprint_forward", "base_loop"],
// 	["spine_tilt_forwardsbackwards", "base_frozen"],

// 	// ["stand_stationary", "weighted_looper"],
// 	// ["stand_unequipped_sprint_forward", "weighted_looper"],
// 	// ["stand_unequipped_sprint_backward", "weighted_looper"],
// 	// ["fullbody_stand_unequipped_jog_forward", "weighted_looper"],
// 	// ["fullbody_stand_unequipped_jog_backward", "weighted_looper"],
// 	// ["stand_unequipped_leftward", "weighted_looper"],
// 	// ["stand_unequipped_rightward", "weighted_looper"],

// 	// ["legs_stand_adjust_left", "primary"],
// 	// ["legs_stand_adjust_right", "primary"],

// 	// ["spine_tilt_forwardsbackwards", "primary_additive"],
// 	// ["legs_swivel", "primary"],


// 	// ["spine", "primary"],

// 	// ["swivel", "primary"],
// 	// ["legs_stand_adjust_left", "primary"],
// 	// ["legs_stand_adjust_right", "primary"],

// 	// ["legs_stand_stationary", "weighted_looper"],
// 	// ["legs_stand_forward", "weighted_looper"],
// 	// ["legs_stand_backward", "weighted_looper"],
// 	// ["legs_stand_leftward", "weighted_looper"],
// 	// ["legs_stand_rightward", "weighted_looper"],

// 	// ["arms_stand_unequipped_stationary", "weighted_looper"],
// 	// ["arms_stand_unequipped_forward", "weighted_looper"],
// 	// ["arms_stand_unequipped_backward", "weighted_looper"],
// 	// ["arms_stand_unequipped_leftward", "weighted_looper"],
// 	// ["arms_stand_unequipped_rightward", "weighted_looper"],
// ] as const satisfies AnimBlueprint<string>

