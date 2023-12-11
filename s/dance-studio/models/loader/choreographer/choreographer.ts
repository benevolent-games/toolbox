
import {Pojo} from "@benev/slate"
import {AssetContainer} from "@babylonjs/core/assetContainer.js"
import {AnimationGroup} from "@babylonjs/core/Animations/animationGroup.js"

import {Molasses} from "./utils/molasses.js"
import {Constrained} from "./utils/constrained.js"
import {scalar} from "../../../../tools/math/scalar.js"
import {Vec2, vec2} from "../../../../tools/math/vec2.js"
import {configure_animation} from "./configure_animations.js"
import {process_animation_groups} from "./utils/process_animation_groups.js"
import { TransformNode } from "@babylonjs/core/Meshes/transformNode.js"
import { Quaternion } from "@babylonjs/core/Maths/math.js"

export class Choreographer {
	readonly all_animations: Pojo<AnimationGroup>
	readonly anims: ReturnType<typeof configure_animation>
	readonly root: TransformNode | null

	constructor(container: AssetContainer) {
		this.root = container.transformNodes.find(n => n.name === "root") ?? null
		this.all_animations = process_animation_groups(container.animationGroups)
		this.anims = configure_animation(this.all_animations)
	}

	#movement_weights = new Molasses(0.1)

	#vertical = new Constrained(0.5, x => scalar.cap(x))
	#horizontal = {
		capsule: new Constrained(0, x => scalar.wrap(x)),
		swivel: new Constrained(0.5, x => scalar.cap(x, 0.25, 0.75)),
		swivel_target: 0.5,
	}

	tick(inputs: {
			look: Vec2
			move: Vec2
		}) {

		const {anims} = this

		const move = this.#movement_weights.update(inputs.move)


		{
			const move_magnitude = vec2.magnitude(move)
			const stillness = scalar.cap(1 - move_magnitude, 0, 1)
			const [x, y] = move
			const w = scalar.cap(y, 0, 1)
			const a = -scalar.cap(x, -1, 0)
			const s = -scalar.cap(y, -1, 0)
			const d = scalar.cap(x, 0, 1)

			{
				const [x, y] = inputs.look
				this.#horizontal.capsule.value += x * 0.01
				this.#horizontal.swivel.value += x * 0.02
				this.#vertical.value += y * 0.01
				if (move_magnitude > 0.1) {
					const diff = this.#horizontal.swivel_target - this.#horizontal.swivel.value
					const d1 = 0.02
					const d2 = d1 > Math.abs(diff)
						? Math.abs(diff)
						: d1
					const delta = diff < 0
						? -d2
						: d2
					this.#horizontal.swivel.value += delta
				}
			}

			// spine and swivel
			this.#apply_weights(
				[anims.spine, 1.0],
				[anims.swivel, 1.0],
			)
			anims.swivel?.goToFrame(this.#horizontal.swivel.value * 1000)
			anims.spine?.goToFrame(this.#vertical.value * 1000)
			if (this.root) {
				const r = 2 * scalar.pi(this.#horizontal.capsule.value)
				this.root.rotationQuaternion = Quaternion.FromEulerAngles(0, -r, 0)
			}

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

