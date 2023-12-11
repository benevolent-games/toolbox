
import {Pojo} from "@benev/slate"
import {AnimationGroup} from "@babylonjs/core/Animations/animationGroup.js"

import {Molasses} from "./utils/molasses.js"
import {Constrained} from "./utils/constrained.js"
import {scalar} from "../../../../tools/math/scalar.js"
import {Vec2, vec2} from "../../../../tools/math/vec2.js"
import {configure_animation} from "./configure_animations.js"
import {process_animation_groups} from "./utils/process_animation_groups.js"

export class Choreographer {
	all_animations: Pojo<AnimationGroup>
	anims: ReturnType<typeof configure_animation>

	constructor(animationGroups: AnimationGroup[]) {
		this.all_animations = process_animation_groups(animationGroups)
		this.anims = configure_animation(this.all_animations)
	}

	#movement_weights = new Molasses(0.1)

	#vertical = new Constrained(0.5, x => scalar.cap(x))
	#horizontal = new Constrained(0, x => scalar.cap(x))

	tick(inputs: {
			look: Vec2
			move: Vec2
		}) {

		const {anims} = this

		const move = this.#movement_weights.update(inputs.move)

		{
			const [x, y] = inputs.look
			this.#horizontal.value += x * 0.01
			this.#vertical.value += y * 0.01
		}

		{
			const stillness = scalar.cap(1 - vec2.magnitude(move), 0, 1)
			const [x, y] = move
			const w = scalar.cap(y, 0, 1)
			const a = -scalar.cap(x, -1, 0)
			const s = -scalar.cap(y, -1, 0)
			const d = scalar.cap(x, 0, 1)

			// spine and swivel
			this.#apply_weights(
				[anims.spine, 1.0],
				[anims.swivel, 1.0],
			)
			anims.swivel?.goToFrame(this.#horizontal.value * 1000)
			anims.spine?.goToFrame(this.#vertical.value * 1000)

			// legs
			this.#apply_weights(
				[anims.legs_stand_stationary, stillness],
				[anims.legs_stand_forward, w],
				[anims.legs_stand_backward, s],
				[anims.legs_stand_leftward, a],
				[anims.legs_stand_rightward, d],
			)

			// arms
			this.#apply_weights(
				[anims.arms_stand_unequipped_stationary, stillness],
				[anims.arms_stand_unequipped_forward, w],
				[anims.arms_stand_unequipped_backward, s],
				[anims.arms_stand_unequipped_leftward, a],
				[anims.arms_stand_unequipped_rightward, d],
			)
		}

	}

	#apply_weights(
			...applications: [AnimationGroup | undefined, weight: number][]
		) {
		for (const [anim, weight] of applications)
			if (anim)
				anim.weight = weight
	}
}

