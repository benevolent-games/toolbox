
import {Quaternion} from "@babylonjs/core/Maths/math.js"

import {Strider} from "./parts/strider.js"
import {Vec2} from "../../../../tools/math/vec2.js"
import {SuperGimbal} from "./parts/super_gimbal.js"
import {scalar} from "../../../../tools/math/scalar.js"
import {CharacterInstance} from "../character/character_instance.js"
import {AdjustmentDirection} from "./parts/utils/adjustment_sequence.js"

export class Choreographer {
	#character: CharacterInstance
	#strider = new Strider({speed: 1 / 10})
	#gimbal: SuperGimbal

	constructor(character: CharacterInstance) {
		this.#character = character
		this.#gimbal = new SuperGimbal({
			swivel_duration: 30,
			sensitivity: 1 / 100,
			swivel_readjustment_margin: 0.1,
		})
	}

	get gimbal(): Vec2 {
		return [this.#gimbal.swivel, this.#gimbal.spine]
	}

	get anims() {
		return this.#character.anims
	}

	adjustment_anim_for_direction(direction: AdjustmentDirection) {
		return direction === "left"
			? this.anims.legs_stand_adjust_left
			: this.anims.legs_stand_adjust_right
	}

	tick({look, move}: {
			look: Vec2
			move: Vec2
		}) {

		const {anims} = this
		const gimbal = this.#gimbal
		const strider = this.#strider

		strider.update(move)

		gimbal.update({
			look,
			character_is_ambulating: strider.magnitude > 0.1,
			adjustment_animations: {
				start: ({direction}) => {
					const anim = this.adjustment_anim_for_direction(direction)
					anim.play(false)
					anim.pause()
				},
				stop: () => {
					anims.legs_stand_adjust_left.stop()
					anims.legs_stand_adjust_right.stop()
				},
				update: ({direction, progress, weight}) => {
					const anim = this.adjustment_anim_for_direction(direction)
					const frame = scalar.map(progress, [
						anim.from,
						anim.to,
					])
					anim.weight = weight
					anim.goToFrame(frame)
				},
			},
		})

		////////////
		////////////

		anims.spine.weight = 1
		anims.spine.goToFrame(gimbal.spine * 1000)

		anims.swivel.weight = 1
		anims.swivel.goToFrame(gimbal.swivel * 1000)

		this.#character.root.rotationQuaternion = (
			Quaternion.FromEulerAngles(
				0, (-2 * Math.PI * gimbal.capsule), 0,
			)
		)

		////////////
		////////////

		const mod = gimbal.modulate_leg_weight.bind(gimbal)

		anims.legs_stand_stationary.weight = mod(strider.stillness)
		anims.legs_stand_forward.weight = mod(strider.north)
		anims.legs_stand_backward.weight = mod(strider.south)
		anims.legs_stand_leftward.weight = mod(strider.west)
		anims.legs_stand_rightward.weight = mod(strider.east)

		anims.arms_stand_unequipped_stationary.weight = strider.stillness
		anims.arms_stand_unequipped_forward.weight = strider.north
		anims.arms_stand_unequipped_backward.weight = strider.south
		anims.arms_stand_unequipped_leftward.weight = strider.west
		anims.arms_stand_unequipped_rightward.weight = strider.east
	}
}

