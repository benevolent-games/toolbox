
import {Quaternion, Vector3} from "@babylonjs/core/Maths/math.js"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"
import {TargetCamera} from "@babylonjs/core/Cameras/targetCamera.js"

import {house} from "../house.js"
import {Vec2, vec2} from "../../../tools/math/vec2.js"
import {Vec3, vec3} from "../../../tools/math/vec3.js"
import {babylonian} from "../../../tools/math/babylonian.js"
import {get_trajectory_from_cardinals} from "../../../impulse/trajectory/get_trajectory_from_cardinals.js"
import {add_to_look_vector_but_cap_vertical_axis} from "../../../common/models/flycam/utils/add_to_look_vector_but_cap_vertical_axis.js"

export const spectatorSystem = house.rezzer(["spectator"], ({realm}) => (state, id) => {
	const {impulse, plate} = realm
	const {position} = state.spectator
	const name = (n: string) => `${n}::${id}`

	const transformA = new TransformNode(name("transform-a"), plate.scene, true)
	const transformB = new TransformNode(name("transform-b"), plate.scene, true)
	const camera = new TargetCamera(name("camera"), Vector3.Zero())

	camera.ignoreParentScaling = true
	camera.parent = transformB
	transformB.parent = transformA

	transformA.position.set(...state.spectator.position)

	realm.plate.setCamera(camera)

	function gather_inputs() {
		const {buttons} = impulse.report.humanoid
		const move = get_trajectory_from_cardinals({
			north: buttons.forward,
			south: buttons.backward,
			east: buttons.rightward,
			west: buttons.leftward,
		})
		const look = get_trajectory_from_cardinals({
			north: buttons.up,
			south: buttons.down,
			east: buttons.right,
			west: buttons.left,
		})
		return {move, look}
	}

	function apply_movement_while_considering_gimbal_rotation(
			position: Vec3,
			move: Vec2,
		) {

		const [x, z] = move
		const translation = new Vector3(x, 0, z)

		const translation_considering_rotation = translation
			.applyRotationQuaternion(transformB.absoluteRotationQuaternion)

		return vec3.add(
			position,
			babylonian.to.vec3(translation_considering_rotation),
		)
	}

	return {
		update(state) {
			const {move, look} = gather_inputs()

			state.spectator.gimbal = add_to_look_vector_but_cap_vertical_axis(
				state.spectator.gimbal,
				vec2.multiplyBy(look, 5 / 100),
			)

			state.spectator.position = (
				apply_movement_while_considering_gimbal_rotation(
					state.spectator.position,
					vec2.multiplyBy(move, 10 / 100),
				)
			)

			const {gimbal} = state.spectator

			transformA.position.set(...state.spectator.position)
			transformB.rotationQuaternion = (
				Quaternion
					.RotationYawPitchRoll(0, -gimbal[1], 0)
			)
			transformA.rotationQuaternion = (
				Quaternion
					.RotationYawPitchRoll(gimbal[0], 0, 0)
			)
		},
		dispose() {
			if (realm.plate.camera === camera)
				realm.plate.setCamera()
			camera.dispose()
			transformA.dispose()
		},
	}
})

