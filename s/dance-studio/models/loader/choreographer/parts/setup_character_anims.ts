
import {BasedAnim} from "./anims/based.js"
import {ManualAnim} from "./anims/manual.js"
import {manifest_anims} from "./utils/manifest_anims.js"
import {CharacterInstance} from "../../character/instance.js"
import {ManualAdditiveAnim} from "./anims/manual_additive.js"

export type CharacterAnims = ReturnType<typeof setup_character_anims>

/*

## specials
- `tpose`
- `head_scale`
- `spine_bend`
- `spine_lean`
- `hips_swivel`
- `grip_left`
- `grip_right`

## stances
- stand
	- `stand`
	- `stand_forward`
	- `stand_backward`
	- `stand_leftward`
	- `stand_rightward`
	- `stand_sprint`
	- `stand_legadjust_left`
	- `stand_legadjust_right`
	- `stand_jump`
- crouch
	- `crouch`
	- `crouch_forward`
	- `crouch_backward`
	- `crouch_leftward`
	- `crouch_rightward`
	- `crouch_legadjust_left`
	- `crouch_legadjust_right`

## arms
- fists
	- `fists`
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
	- `twohander`
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
- (4) right underhand
- (5) left underhand
- (6) left swing
- (7) left stab
- (8) right stab

*/

export const setup_character_anims = (character: CharacterInstance) => manifest_anims({
	tpose: g => new ManualAnim(g),
	head_scale: g => new ManualAdditiveAnim(g, 50),
	spine_bend: g => new ManualAdditiveAnim(g, 500),
	spine_lean: g => new ManualAdditiveAnim(g, 500),
	hips_swivel: g => new ManualAdditiveAnim(g, 500),
	grip_left: g => new ManualAdditiveAnim(g, 500),
	grip_right: g => new ManualAdditiveAnim(g, 500),

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

