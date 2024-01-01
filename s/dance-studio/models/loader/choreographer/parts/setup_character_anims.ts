
import {BasedAnim} from "./anims/based.js"
import {manifest_anims} from "./utils/manifest_anims.js"
import {CharacterInstance} from "../../character/instance.js"
import {ManualAdditiveAnim} from "./anims/manual_additive.js"
import { ManualAnim } from "./anims/manual.js"

export type CharacterAnims = ReturnType<typeof setup_character_anims>

/*

**specials**
- `tpose`
- `head_scale`
- `spine_bend`
- `spine_lean`
- `hips_swivel`
- `grip_left`
- `grip_right`

**base**
- stand
	- `stand_ready`
	- `stand_forward`
	- `stand_backward`
	- `stand_leftward`
	- `stand_rightward`
	- `stand_sprint`
	- `stand_legadjust_left`
	- `stand_legadjust_right`
	- `stand_jump`
- crouch
	- `crouch_ready`
	- `crouch_forward`
	- `crouch_backward`
	- `crouch_leftward`
	- `crouch_rightward`
	- `crouch_legadjust_left`
	- `crouch_legadjust_right`
- arms
	- fists
		- `fists_ready`
		- `fists_forward`
		- `fists_backward`
		- `fists_leftward`
		- `fists_rightward`
		- `fists_sprint`
		- `fists_attack_1`
		- `fists_attack_2`
		- `fists_attack_3`
		- `fists_attack_4`
		- `fists_attack_5`
		- `fists_attack_6`
		- `fists_attack_7`
		- `fists_attack_8`
	- twohander
		- `twohander_ready`
		- `twohander_forward`
		- `twohander_backward`
		- `twohander_leftward`
		- `twohander_rightward`
		- `twohander_sprint`
		- `twohander_attack_1`
		- `twohander_attack_2`
		- `twohander_attack_3`
		- `twohander_attack_4`
		- `twohander_attack_5`
		- `twohander_attack_6`
		- `twohander_attack_7`
		- `twohander_attack_8`

**diagram of attack numbers**
```
  1       2
   \     /
6 — (7-8) — 3
   /     \
  5       4
```
- (1) left overhead
- (2) right overhead
- (3) right swing
- (4) left underhand
- (5) left swing
- (6) left overhead
- (7) left stab
- (8) right stab

*/

export const setup_character_anims = (character: CharacterInstance) => manifest_anims({
	tpose: g => new ManualAnim(g),
	head_scale: g => new ManualAdditiveAnim(g, 50),
	spine_tilt_forwardsbackwards: g => new ManualAdditiveAnim(g, 500),
	legs_swivel: g => new ManualAdditiveAnim(g, 500),
	hands_close_right: g => new ManualAdditiveAnim(g, 500),
	hands_close_left: g => new ManualAdditiveAnim(g, 500),

	stand_stationary: g => new BasedAnim(g),
	body_stand_unequipped_jog_forward: g => new BasedAnim(g),
	body_stand_unequipped_jog_backward: g => new BasedAnim(g),
	body_unequipped_sprint_forward: g => new BasedAnim(g),
	legs_stand_adjust_right: g => new BasedAnim(g),
	legs_stand_adjust_left: g => new BasedAnim(g),
	arms_stationary: g => new BasedAnim(g),
	arms_stand_unequipped_jog_forward: g => new BasedAnim(g),
	arms_unequipped_sprint_forward: g => new BasedAnim(g),

	// arms_unequipped_sprint_backward: g => new BasedAnim(g),
	// spine_tilt_leftright: g => new BasedAnim(g),
	// arms_stationary_2handedsword: g => new BasedAnim(g),
	// arms_stationary_fists: g => new BasedAnim(g),
	// spine_swivel: g => new BasedAnim(g),
	// legs_jump: g => new BasedAnim(g),
	// legs_crouch_adjust_right: g => new BasedAnim(g),
	// legs_crouch_adjust_left: g => new BasedAnim(g),
	// arms_stand_2handedsword_rightswing: g => new BasedAnim(g),
	// arms_crouch_unequipped_backward: g => new BasedAnim(g),
	// arms_crouch_unequipped_forward: g => new BasedAnim(g),
	// arms_crouch_unequipped_leftward: g => new BasedAnim(g),
	// arms_crouch_unequipped_rightward: g => new BasedAnim(g),
	// arms_stand_2handedsword_leftswing: g => new BasedAnim(g),
	// arms_stand_2handedsword_overhand_left: g => new BasedAnim(g),
	// arms_stand_2handedsword_overhand_right: g => new BasedAnim(g),
	// arms_stand_2handedsword_underhand_left: g => new BasedAnim(g),
	// arms_stand_2handedsword_underhand_right: g => new BasedAnim(g),
	// arms_stand_unequipped_jog_backward: g => new BasedAnim(g),
	// body_crouch_unequipped_backward: g => new BasedAnim(g),
	// body_crouch_unequipped_forward: g => new BasedAnim(g),
	// body_crouch_unequipped_leftward: g => new BasedAnim(g),
	// body_crouch_unequipped_rightward: g => new BasedAnim(g),
	// spine_stand_2handedsword_leftswing: g => new BasedAnim(g),
	// spine_stand_2handedsword_overhand_left: g => new BasedAnim(g),
	// spine_stand_2handedsword_overhand_right: g => new BasedAnim(g),
	// spine_stand_2handedsword_rightswing: g => new BasedAnim(g),
	// spine_stand_2handedsword_underhand_left: g => new BasedAnim(g),
	// spine_stand_2handedsword_underhand_right: g => new BasedAnim(g),
}, name => character.get_animation_group(name))

