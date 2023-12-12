
import {Quaternion} from "@babylonjs/core/Maths/math.js"

import {Gimbal} from "./parts/gimbal.js"
import {Strider} from "./parts/strider.js"
import {Vec2} from "../../../../tools/math/vec2.js"
import {CharacterInstance} from "../character/character_instance.js"

export class Choreographer {
	#character: CharacterInstance
	#strider = new Strider({speed: 1 / 10})
	#gimbal = new Gimbal({sensitivity: 1 / 100})

	constructor(character: CharacterInstance) {
		this.#character = character
	}

	get anims() {
		return this.#character.anims
	}

	tick({look, move}: {
			look: Vec2
			move: Vec2
		}) {

		const {anims} = this
		const {spine, capsule, swivel} = this.#gimbal.update(look)

		anims.spine.weight = 1
		anims.spine.goToFrame(spine * 1000)

		anims.swivel.weight = 1
		anims.swivel.goToFrame(swivel * 1000)

		this.#character.root.rotationQuaternion = (
			Quaternion.FromEulerAngles(
				0, (-2 * Math.PI * capsule), 0,
			)
		)

		const {
			stillness,
			north, south, west, east,
		} = this.#strider.update(move)

		anims.legs_stand_stationary.weight = stillness
		anims.legs_stand_forward.weight = north
		anims.legs_stand_backward.weight = south
		anims.legs_stand_leftward.weight = west
		anims.legs_stand_rightward.weight = east

		anims.arms_stand_unequipped_stationary.weight = stillness
		anims.arms_stand_unequipped_forward.weight = north
		anims.arms_stand_unequipped_backward.weight = south
		anims.arms_stand_unequipped_leftward.weight = west
		anims.arms_stand_unequipped_rightward.weight = east
	}
}

// export class Choreographer {
// 	readonly all_animations: Pojo<AnimationGroup>
// 	readonly anims: ReturnType<typeof configure_animation>
// 	readonly root: TransformNode | null

// 	constructor(container: AssetContainer) {
// 		this.root = container.transformNodes.find(n => n.name === "root") ?? null
// 		this.all_animations = process_animation_groups(container.animationGroups)
// 		this.anims = configure_animation(this.all_animations)
// 	}

// 	#movement_weights = new Molasses(0.1)

// 	#vertical = new Constrained(0.5, x => scalar.cap(x))

// 	#horizontal = {
// 		capsule: new Constrained(0, x => scalar.wrap(x)),
// 		swivel: new Constrained(0.5, x => scalar.cap(x)),
// 		swivel_center: 0.5,
// 		is_yoinking: false,
// 		yoink_timeline: {
// 			current: 0,
// 		},
// 	}

// 	#yoinker = (() => {
// 		let yoink: null | {
// 			progress: number
// 			weight: number
// 			direction: "left" | "right"
// 		}

// 		const speed = 1 / 60

// 		const adjustment_animation = (() => {
// 			return {

// 				initiate: (direction: "left" | "right") => {
// 					const {anims} = this

// 					if (direction === "left" && anims.legs_stand_adjust_left) {
// 						anims.legs_stand_adjust_right?.stop()
// 						anims.legs_stand_adjust_left.play(false)
// 						anims.legs_stand_adjust_left.pause()
// 					}

// 					else if (direction === "right" && anims.legs_stand_adjust_right) {
// 						anims.legs_stand_adjust_left?.stop()
// 						anims.legs_stand_adjust_right.play(false)
// 						anims.legs_stand_adjust_right.pause()
// 					}
// 				},

// 				update: (direction: "left" | "right", progress: number, weight: number) => {
// 					const {anims} = this

// 					if (direction === "left" && anims.legs_stand_adjust_left) {
// 						anims.legs_stand_adjust_left.weight = weight
// 						anims.legs_stand_adjust_left.goToFrame(progress * anims.legs_stand_adjust_left.to)
// 					}
// 					else if (direction === "right" && anims.legs_stand_adjust_right) {
// 						anims.legs_stand_adjust_right.weight = weight
// 						anims.legs_stand_adjust_right.goToFrame(progress * anims.legs_stand_adjust_right.to)
// 					}
// 				},

// 				stop: () => {
// 					const {anims} = this
// 					anims.legs_stand_adjust_left?.stop()
// 					anims.legs_stand_adjust_right?.stop()
// 				},
// 			}
// 		})()

// 		const consider_starting_the_yoink = () => {
// 			if (!yoink) {
// 				const swivel = this.#horizontal.swivel.value
// 				const in_yoink_territory = !scalar.within(
// 					swivel,
// 					0.1,
// 					0.9,
// 				)
// 				if (in_yoink_territory) {
// 					yoink = {
// 						progress: 0,
// 						weight: 0,
// 						direction: swivel > 0.5
// 							? "right"
// 							: "left"
// 					}
// 					adjustment_animation.initiate(yoink.direction)
// 				}
// 			}
// 		}

// 		const end_the_yoink = () => {
// 			yoink = null
// 			adjustment_animation.stop()
// 		}

// 		const tick = ({is_moving}: {is_moving: boolean}) => {
// 			consider_starting_the_yoink()

// 			if (yoink) {
// 				yoink.progress += speed

// 				if (yoink.progress >= 1)
// 					end_the_yoink()

// 				else {
// 					yoink.weight = scalar.spline.quickLinear(yoink.progress, [0, 1, 1, 0])
// 					adjustment_animation.update(yoink.direction, yoink.progress, yoink.weight)
// 				}
// 			}

// 			if (yoink || is_moving) {
// 				const speed = 0.04
// 				const diff = this.#horizontal.swivel_center - this.#horizontal.swivel.value

// 				if (Math.abs(diff) <= speed) {
// 					this.#horizontal.swivel.value = this.#horizontal.swivel_center
// 					this.#horizontal.is_yoinking = false
// 				}
// 				else
// 					this.#horizontal.swivel.value += (diff < 0)
// 						? -speed
// 						: speed
// 			}
// 		}

// 		const leg_weight = (w: number) => {
// 			const yoinkWeight = yoink?.weight ?? 0
// 			return scalar.cap(w - yoinkWeight)
// 		}

// 		return {
// 			tick,
// 			leg_weight,
// 		}
// 	})()

// 	tick(inputs: {
// 			look: Vec2
// 			move: Vec2
// 		}) {

// 		const {anims} = this
// 		const yoinker = this.#yoinker

// 		const move = this.#movement_weights.update(inputs.move)

// 		{
// 			const move_magnitude = vec2.magnitude(move)
// 			const stillness = scalar.cap(1 - move_magnitude, 0, 1)
// 			const [x, y] = move
// 			const w = scalar.cap(y, 0, 1)
// 			const a = -scalar.cap(x, -1, 0)
// 			const s = -scalar.cap(y, -1, 0)
// 			const d = scalar.cap(x, 0, 1)

// 			{
// 				const [x, y] = inputs.look
// 				this.#horizontal.capsule.value += x * 0.01
// 				this.#horizontal.swivel.value += x * 0.02
// 				this.#vertical.value += y * 0.01

// 				yoinker.tick({is_moving: move_magnitude > 0.1})
// 			}

// 			// spine and swivel
// 			this.#apply_weights(
// 				[anims.spine, 1.0],
// 				[anims.swivel, 1.0],
// 			)
// 			anims.swivel?.goToFrame(this.#horizontal.swivel.value * 1000)
// 			anims.spine?.goToFrame(this.#vertical.value * 1000)
// 			if (this.root) {
// 				const r = 2 * scalar.pi(this.#horizontal.capsule.value)
// 				this.root.rotationQuaternion = Quaternion.FromEulerAngles(0, -r, 0)
// 			}

// 			// legs
// 			this.#apply_weights(
// 				[anims.legs_stand_stationary, yoinker.leg_weight(stillness)],
// 				[anims.legs_stand_forward, yoinker.leg_weight(w)],
// 				[anims.legs_stand_backward, yoinker.leg_weight(s)],
// 				[anims.legs_stand_leftward, yoinker.leg_weight(a)],
// 				[anims.legs_stand_rightward, yoinker.leg_weight(d)],
// 			)

// 			// arms
// 			this.#apply_weights(
// 				[anims.arms_stand_unequipped_stationary, stillness],
// 				[anims.arms_stand_unequipped_forward, w],
// 				[anims.arms_stand_unequipped_backward, s],
// 				[anims.arms_stand_unequipped_leftward, a],
// 				[anims.arms_stand_unequipped_rightward, d],
// 			)
// 		}

// 	}

// 	#apply_weights(
// 			...applications: [AnimationGroup | undefined, weight: number][]
// 		) {
// 		for (const [anim, weight] of applications)
// 			if (anim)
// 				anim.weight = weight
// 	}
// }

