
// import {AnimationGroup} from "@babylonjs/core/Animations/animationGroup.js"
// import {Constrained} from "../utils/constrained.js"
// import {scalar} from "../../../../../tools/math/scalar.js"

// /*

// Choreographer
// 	anims

// 	legs
// 	arms
// 	spine
// 	swivel

// */

// export type LegAdjustAnims = {}

// export class Anim {
// 	#group: AnimationGroup | undefined

// 	constructor(animationGroup?: AnimationGroup) {
// 		this.#group = animationGroup
// 	}

// 	get weight() {
// 		return this.#group?.weight ?? 0
// 	}

// 	set weight(w: number) {
// 		if (this.#group)
// 			this.#group.weight = w
// 	}

// 	goToFrame(frame: number) {
// 		if (this.#group)
// 			this.#group.goToFrame(frame)
// 	}

// }

// export class LegAnimator {
// 	#anims

// 	tick({}: {

// 	}) {}
// }

// export class CharacterHorizontal {
// 	capsule = new Constrained(0, x => scalar.wrap(x))
// 	swivel = new Constrained(0.5, x => scalar.cap(x))
// 	legAdjustAnim: LegAdjustAnim | null = null

// 	constructor({}: {}) {

// 	}

// 	tick({character_is_ambulating}: {
// 			character_is_ambulating: boolean
// 		}) {


// 	}

// 	get #readjust_is_necessary() {
// 		return !scalar.within(this.swivel.value, 0.1, 0.9)
// 	}

// 	#consider_starting_leg_adjust_anim() {
// 		if (!this.legAdjustAnim && this.#readjust_is_necessary) {
// 			this.legAdjustAnim = new LegAdjustAnim()
// 		}
// 	}
// }

// export class LegAdjustAnim {

// }

// export function leg_adjustment_animator(options: {
// 		animLeft?: AnimationGroup
// 		animRight?: AnimationGroup
// 	}) {

// 	function reset() {

// 	}
// }

