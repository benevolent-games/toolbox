
import {Scene} from "@babylonjs/core/scene.js"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"

import {flatten} from "./utils/flatten.js"
import {label} from "../../../tools/label.js"
import {molasses3d} from "./utils/molasses.js"
import {Quat} from "../../../tools/math/quat.js"
import {gimbaltool} from "./utils/gimbaltool.js"
import {scalar} from "../../../tools/math/scalar.js"
import {Vec3, vec3} from "../../../tools/math/vec3.js"
import {babylonian} from "../../../tools/math/babylonian.js"
import {make_dummy_anim_group} from "./choreography/dummy_anim_group.js"
import {sync_character_anims} from "./choreography/sync_character_anims.js"
import {CharacterAnims, setup_character_anims} from "./choreography/setup_character_anims.js"
import {CharacterContainer} from "../../../dance-studio/models/loader/character/container.js"
import {AdjustmentAnims, AdjustmentDirection} from "../../../dance-studio/models/loader/choreographer/types.js"
import {calculate_ambulatory_report, apply_adjustments, swivel_effected_by_glance} from "./choreography/calculations.js"
import {calculate_adjustment_weight} from "../../../dance-studio/models/loader/choreographer/parts/utils/calculate_adjustment_weight.js"
import { mainthread } from "../hub.js"

export const choreography_system = mainthread.lifecycle("choreography")(
		"humanoid",
		"height",
		"speeds",
		"position",
		"rotation",
		"gimbal",
		"intent",
		"velocity",
		"choreography",
	)(realm => init => {

	const babylon = prepare_choreographer_babylon_parts({
		scene: realm.stage.scene,
		characterContainer: realm.containers.character,
		state: init,
	})

	const anims = setup_character_anims(babylon.characterInstance)

	console.log("anims", anims)

	const ambulation_anims = [
		anims.stand_forward,
		anims.stand_backward,
		anims.stand_leftward,
		anims.stand_rightward,
		anims.stand_sprint,

		anims.crouch_forward,
		anims.crouch_backward,
		anims.crouch_leftward,
		anims.crouch_rightward,

		anims.fists_forward,
		anims.fists_backward,
		anims.fists_leftward,
		anims.fists_rightward,
		anims.fists_sprint,

		anims.twohander,
		anims.twohander_forward,
		anims.twohander_backward,
		anims.twohander_leftward,
		anims.twohander_rightward,
		anims.twohander_sprint,
	]

	const boss_anim = make_dummy_anim_group({
		scene: realm.stage.scene,
		frames: anims.stand_forward.to,
		framerate: 60,
	})

	boss_anim.play(true)

	for (const anim of ambulation_anims)
		anim.group?.syncAllAnimationsWith(boss_anim.animatables[0])

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
		update(tick, state) {
			babylon.position.set(...state.position)
			babylon.rotation.set(...state.rotation)

			smoothed_velocity = molasses3d(
				5,
				smoothed_velocity,
				vec3.divideBy(state.velocity, state.speeds.base * tick.deltaTime),
			)

			state.choreography.swivel = swivel_effected_by_glance(
				state.choreography.swivel,
				state.intent.glance,
			)

			const local_velocity = gimbaltool(state.gimbal).unrotate(smoothed_velocity)
			const ambulatory = calculate_ambulatory_report(flatten(local_velocity))

			apply_adjustments(
				adjustment_anims,
				ambulatory,
				state.choreography,
				10,
			)

			sync_character_anims({
				gimbal: state.gimbal,
				choreo: state.choreography,
				anims,
				ambulatory,
				boss_anim,
				adjustment_anims,
				anim_speed_modifier: 1.3,
			})
		},
		dispose() {
			babylon.dispose()
		},
	}
})

///////////////////////////////////////
///////////////////////////////////////

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

	const transform = new TransformNode(label("choreographyTransform"), scene)
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

