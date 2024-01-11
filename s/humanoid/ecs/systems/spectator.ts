
import {Quaternion, Vector3} from "@babylonjs/core/Maths/math.js"
import {TargetCamera} from "@babylonjs/core/Cameras/targetCamera.js"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"

import {rezzer} from "../house.js"
import {Vec2, vec2} from "../../../tools/math/vec2.js"
import {Vec3, vec3} from "../../../tools/math/vec3.js"
import {babylonian} from "../../../tools/math/babylonian.js"
import {add_to_look_vector_but_cap_vertical_axis} from "../../../common/models/flycam/utils/add_to_look_vector_but_cap_vertical_axis.js"

export const spectator_system = rezzer(
		"spectator", "intent", "gimbal", "position",
	)(realm => (state, id) => {

	const {stage} = realm
	const name = (n: string) => `${n}::${id}`

	const transformA = new TransformNode(name("transform-a"), stage.scene, true)
	const transformB = new TransformNode(name("transform-b"), stage.scene, true)
	const camera = new TargetCamera(name("camera"), Vector3.Zero())

	camera.ignoreParentScaling = true
	camera.parent = transformB
	transformB.parent = transformA

	transformA.position.set(...state.position)

	stage.rendering.setCamera(camera)

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
			const {intent, sensitivity} = state

			state.gimbal = add_to_look_vector_but_cap_vertical_axis(
				state.gimbal,
				intent.glance,
			)

			state.position = (
				apply_movement_while_considering_gimbal_rotation(
					state.position,
					vec2.multiplyBy(intent.amble, 3 / 10),
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
			if (stage.rendering.camera === camera)
				stage.rendering.setCamera(null)
			camera.dispose()
			transformA.dispose()
		},
	}
})

