
import {Quaternion, Vector3} from "@babylonjs/core/Maths/math.js"
import {TargetCamera} from "@babylonjs/core/Cameras/targetCamera.js"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"

import {house} from "../house.js"
import {Vec2, vec2} from "../../../tools/math/vec2.js"
import {Vec3, vec3} from "../../../tools/math/vec3.js"
import {babylonian} from "../../../tools/math/babylonian.js"
import {gather_input_vectors} from "./commons/gather_input_vectors.js"
import {add_to_look_vector_but_cap_vertical_axis} from "../../../common/models/flycam/utils/add_to_look_vector_but_cap_vertical_axis.js"

export const spectatorSystem = house.rezzer(
	["spectator", "position", "gimbal"],
	({realm}) => (state, id) => {

	const {impulse, stage} = realm
	const name = (n: string) => `${n}::${id}`

	const transformA = new TransformNode(name("transform-a"), stage.scene, true)
	const transformB = new TransformNode(name("transform-b"), stage.scene, true)
	const camera = new TargetCamera(name("camera"), Vector3.Zero())

	camera.ignoreParentScaling = true
	camera.parent = transformB
	transformB.parent = transformA

	transformA.position.set(...state.position)

	stage.cameraRig.set(camera)

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
			const {move, look} = gather_input_vectors(impulse)

			state.gimbal = add_to_look_vector_but_cap_vertical_axis(
				state.gimbal,
				vec2.multiplyBy(look, 5 / 100),
			)

			state.position = (
				apply_movement_while_considering_gimbal_rotation(
					state.position,
					vec2.multiplyBy(move, 10 / 100),
				)
			)

			const {gimbal} = state
			transformA.position.set(...state.position)
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
			if (stage.cameraRig.current === camera)
				stage.cameraRig.set()
			camera.dispose()
			transformA.dispose()
		},
	}
})

