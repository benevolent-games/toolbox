
import {BasedAnim} from "./anims/based.js"
import {manifest_anims} from "./utils/manifest_anims.js"
import {CharacterInstance} from "../../character/instance.js"
import {ManualAdditiveAnim} from "./anims/manual_additive.js"

export type CharacterAnims = ReturnType<typeof setup_character_anims>

export const setup_character_anims = (character: CharacterInstance) => manifest_anims({

	arms_stationary_2handedsword: g => new BasedAnim(g),
	arms_stationary_fists: g => new BasedAnim(g),
	fullbody_crouch_unequipped_backward: g => new BasedAnim(g),
	fullbody_crouch_unequipped_forward: g => new BasedAnim(g),
	fullbody_crouch_unequipped_leftward: g => new BasedAnim(g),
	fullbody_crouch_unequipped_rightward: g => new BasedAnim(g),
	hands_close_left: g => new BasedAnim(g),
	hands_close_right: g => new BasedAnim(g),
	legs_crouch_adjust_left: g => new BasedAnim(g),
	legs_crouch_adjust_right: g => new BasedAnim(g),
	legs_jump: g => new BasedAnim(g),
	legs_stand_adjust_left: g => new BasedAnim(g),
	legs_stand_adjust_right: g => new BasedAnim(g),
	stand_stationary: g => new BasedAnim(g),
	stand_stationary_fists: g => new BasedAnim(g),
	stand_unequipped_leftward: g => new BasedAnim(g),
	stand_unequipped_rightward: g => new BasedAnim(g),
	stand_unequipped_sprint_backward: g => new BasedAnim(g),
	stand_unequipped_sprint_forward: g => new BasedAnim(g),
	torso_stand_2handedsword_leftswing: g => new BasedAnim(g),
	torso_stand_2handedsword_overhand_left: g => new BasedAnim(g),
	torso_stand_2handedsword_overhand_right: g => new BasedAnim(g),
	torso_stand_2handedsword_rightswing: g => new BasedAnim(g),
	torso_stand_2handedsword_underhand_left: g => new BasedAnim(g),
	torso_stand_2handedsword_underhand_right: g => new BasedAnim(g),
	tpose: g => new BasedAnim(g),
	fullbody_stand_unequipped_jog_backward: g => new BasedAnim(g),
	fullbody_stand_unequipped_jog_forward: g => new BasedAnim(g),

	spine_tilt_forwardsbackwards: g => new ManualAdditiveAnim(g, 700),
	spine_tilt_leftright: g => new ManualAdditiveAnim(g, 500),
	legs_swivel: g => new ManualAdditiveAnim(g, 500),
	spine_swivel: g => new ManualAdditiveAnim(g, 500),

}, name => character.get_animation_group(name))

