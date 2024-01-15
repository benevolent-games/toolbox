
import {CharacterInstance} from "../../../../dance-studio/models/loader/character/instance.js"
import {BasedAnim} from "../../../../dance-studio/models/loader/choreographer/parts/anims/based.js"
import {ManualAnim} from "../../../../dance-studio/models/loader/choreographer/parts/anims/manual.js"
import {manifest_anims} from "../../../../dance-studio/models/loader/choreographer/parts/utils/manifest_anims.js"
import {ManualAdditiveAnim} from "../../../../dance-studio/models/loader/choreographer/parts/anims/manual_additive.js"

export type CharacterAnims = ReturnType<typeof setup_character_anims>

export const setup_character_anims = (character: CharacterInstance) => manifest_anims({
	tpose: g => new ManualAnim(g),
	spine_bend: g => new ManualAdditiveAnim(g, 50),
	spine_lean: g => new ManualAdditiveAnim(g, 50),
	hips_swivel: g => new ManualAdditiveAnim(g, 50),
	head_scale: g => new ManualAdditiveAnim(g, 50),
	grip_left: g => new ManualAnim(g),
	grip_right: g => new ManualAnim(g),

	jump: g => new BasedAnim(g),
	stand: g => new BasedAnim(g),
	stand_forward: g => new BasedAnim(g),
	stand_backward: g => new BasedAnim(g),
	stand_leftward: g => new BasedAnim(g),
	stand_rightward: g => new BasedAnim(g),
	stand_sprint: g => new BasedAnim(g),
	stand_legadjust_left: g => new ManualAdditiveAnim(g, 0),
	stand_legadjust_right: g => new ManualAdditiveAnim(g, 0),

	crouch: g => new BasedAnim(g),
	crouch_forward: g => new BasedAnim(g),
	crouch_backward: g => new BasedAnim(g),
	crouch_leftward: g => new BasedAnim(g),
	crouch_rightward: g => new BasedAnim(g),
	crouch_legadjust_left: g => new ManualAdditiveAnim(g, 0),
	crouch_legadjust_right: g => new ManualAdditiveAnim(g, 0),

	unarmed: g => new BasedAnim(g),
	unarmed_forward: g => new BasedAnim(g),
	unarmed_backward: g => new BasedAnim(g),
	unarmed_leftward: g => new BasedAnim(g),
	unarmed_rightward: g => new BasedAnim(g),
	unarmed_sprint: g => new BasedAnim(g),
	unarmed_attack_1: g => new ManualAnim(g),
	unarmed_attack_2: g => new ManualAnim(g),
	unarmed_attack_3: g => new ManualAnim(g),
	unarmed_attack_4: g => new ManualAnim(g),
	unarmed_attack_5: g => new ManualAnim(g),
	unarmed_attack_6: g => new ManualAnim(g),
	unarmed_attack_7: g => new ManualAnim(g),
	unarmed_attack_8: g => new ManualAnim(g),

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

