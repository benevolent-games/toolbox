
import {BasedAnim} from "./anims/based.js"
import {ManualAnim} from "./anims/manual.js"
import {manifest_anims} from "./utils/manifest_anims.js"
import {CharacterInstance} from "../../character/instance.js"
import {ManualAdditiveAnim} from "./anims/manual_additive.js"

export type CharacterAnims = ReturnType<typeof setup_character_anims>

export const setup_character_anims = (character: CharacterInstance) => manifest_anims({
	tpose: g => new ManualAnim(g),
	head_scale: g => new ManualAdditiveAnim(g, 50),
	spine_bend: g => new ManualAdditiveAnim(g, 500),
	spine_lean: g => new ManualAdditiveAnim(g, 500),
	hips_swivel: g => new ManualAdditiveAnim(g, 500),
	grip_left: g => new ManualAnim(g),
	grip_right: g => new ManualAnim(g),

	stand: g => new BasedAnim(g),
	stand_forward: g => new BasedAnim(g),
	stand_backward: g => new BasedAnim(g),
	stand_leftward: g => new BasedAnim(g),
	stand_rightward: g => new BasedAnim(g),
	stand_sprint: g => new BasedAnim(g),
	stand_legadjust_left: g => new ManualAdditiveAnim(g, 0),
	stand_legadjust_right: g => new ManualAdditiveAnim(g, 0),
	stand_jump: g => new BasedAnim(g),

	crouch: g => new BasedAnim(g),
	crouch_forward: g => new BasedAnim(g),
	crouch_backward: g => new BasedAnim(g),
	crouch_leftward: g => new BasedAnim(g),
	crouch_rightward: g => new BasedAnim(g),
	crouch_legadjust_left: g => new ManualAdditiveAnim(g, 0),
	crouch_legadjust_right: g => new ManualAdditiveAnim(g, 0),

	fists: g => new BasedAnim(g),
	fists_forward: g => new BasedAnim(g),
	fists_backward: g => new BasedAnim(g),
	fists_leftward: g => new BasedAnim(g),
	fists_rightward: g => new BasedAnim(g),
	fists_sprint: g => new BasedAnim(g),
	fists_attack_1: g => new ManualAnim(g),
	fists_attack_2: g => new ManualAnim(g),
	fists_attack_3: g => new ManualAnim(g),
	fists_attack_4: g => new ManualAnim(g),
	fists_attack_5: g => new ManualAnim(g),
	fists_attack_6: g => new ManualAnim(g),
	fists_attack_7: g => new ManualAnim(g),
	fists_attack_8: g => new ManualAnim(g),

	twohander: g => new BasedAnim(g),
	twohander_forward: g => new BasedAnim(g),
	twohander_backward: g => new BasedAnim(g),
	twohander_leftward: g => new BasedAnim(g),
	twohander_rightward: g => new BasedAnim(g),
	twohander_sprint: g => new BasedAnim(g),
	twohander_attack_1: g => new ManualAnim(g),
	twohander_attack_2: g => new ManualAnim(g),
	twohander_attack_3: g => new ManualAnim(g),
	twohander_attack_4: g => new ManualAnim(g),
	twohander_attack_5: g => new ManualAnim(g),
	twohander_attack_6: g => new ManualAnim(g),
	twohander_attack_7: g => new ManualAnim(g),
	twohander_attack_8: g => new ManualAnim(g),
}, name => character.get_animation_group(name))

