
import {Scene} from "@babylonjs/core/scene.js"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"

import {rezzer} from "../house.js"
import {molasses3d} from "./utils/molasses.js"
import {Quat} from "../../../tools/math/quat.js"
import {gimbaltool} from "./utils/gimbaltool.js"
import {labeler} from "../../../tools/labeler.js"
import {scalar} from "../../../tools/math/scalar.js"
import {Vec3, vec3} from "../../../tools/math/vec3.js"
import {babylonian} from "../../../tools/math/babylonian.js"
import {sync_character_anims} from "./choreography/sync_character_anims.js"
import {CharacterContainer} from "../../../dance-studio/models/loader/character/container.js"
import {AdjustmentAnims, AdjustmentDirection} from "../../../dance-studio/models/loader/choreographer/types.js"
import {calculate_ambulatory_report, apply_adjustments, swivel_effected_by_glance} from "./choreography/calculations.js"
import {CharacterAnims, setup_character_anims} from "../../../dance-studio/models/loader/choreographer/parts/setup_character_anims.js"
import {calculate_adjustment_weight} from "../../../dance-studio/models/loader/choreographer/parts/utils/calculate_adjustment_weight.js"

export const choreography_system = rezzer(
		"humanoid",
		"height",
		"position",
		"rotation",
		"gimbal",
		"intent",
		"smoothing",
		"velocity",
		"choreography",
	)(realm => init => {

	const babylon = prepare_choreographer_babylon_parts({
		scene: realm.stage.scene,
		characterContainer: realm.containers.character,
		state: init,
	})

	const anims = setup_character_anims(babylon.characterInstance)

	// initialize with tpose
	if (anims.tpose.group) {
		anims.tpose.group.weight = -1
		anims.tpose.group.play(false)
		anims.tpose.group.pause()
		anims.tpose.group.goToFrame(0)
	}

	const adjustment_anims: AdjustmentAnims = {
		start: () => {},
		stop: () => {
			anims.stand_legadjust_left.weight = 0
			anims.stand_legadjust_right.weight = 0
		},
		update: ({direction, progress}) => {
			const anim = adjustment_anim_for_direction(anims, direction)
			const frame = scalar.map(progress, [
				anim.from,
				anim.to,
			])
			anim.weight = calculate_adjustment_weight(progress)
			anim.forceFrame(frame)
		},
	}

	let smoothed_velocity = init.velocity

	return {
		update(state) {
			babylon.position.set(...state.position)
			babylon.rotation.set(...state.rotation)

			smoothed_velocity = molasses3d(
				1 / state.smoothing,
				smoothed_velocity,
				vec3.multiplyBy(state.velocity, 10),
			)

			state.choreography.swivel = swivel_effected_by_glance(
				state.choreography.swivel,
				state.intent.glance,
			)

			const [vx,,vz] = smoothed_velocity
			const velocity_localized = gimbaltool(state.gimbal).horizontal_unrotate([vx, vz])
			const ambulatory = calculate_ambulatory_report(velocity_localized)

			apply_adjustments(
				adjustment_anims,
				ambulatory,
				state.choreography,
			)

			sync_character_anims(
				state.gimbal,
				state.choreography,
				ambulatory,
				anims,
				adjustment_anims,
			)
		},
		dispose() {
			babylon.dispose()
		},
	}
})

///////////////////////////////////////
///////////////////////////////////////

const label = labeler("choreography")

export function prepare_choreographer_babylon_parts(o: {
		scene: Scene
		characterContainer: CharacterContainer
		state: {
			height: number
			position: Vec3
			rotation: Quat
		}
	}) {

	const {scene, characterContainer, state} = o

	const transform = new TransformNode(label("transform"), scene)
	const character = characterContainer.instance([0, -(state.height / 2), 0])
	character.root.setParent(transform)

	const position
		= transform.position
		= babylonian.from.vec3(state.position)

	const rotation
		= transform.rotationQuaternion
		= babylonian.from.quat(state.rotation)

	return {
		transform,
		characterInstance: character,
		position,
		rotation,
		dispose() {
			character.dispose()
			transform.dispose()
		},
	}
}

function adjustment_anim_for_direction(
		anims: CharacterAnims,
		direction: AdjustmentDirection,
	) {
	return direction === "left"
		? anims.stand_legadjust_left
		: anims.stand_legadjust_right
}


