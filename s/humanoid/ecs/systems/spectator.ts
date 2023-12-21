
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"
import {house} from "../house.js"
import {add_to_look_vector_but_cap_vertical_axis} from "../../../common/models/flycam/utils/add_to_look_vector_but_cap_vertical_axis.js"
import {get_trajectory_from_cardinals} from "../../../impulse/trajectory/get_trajectory_from_cardinals.js"
import { TargetCamera } from "@babylonjs/core/Cameras/targetCamera.js"
import { Vector3 } from "@babylonjs/core/Maths/math.js"

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

	function capture_inputs() {

	}

	function actuate_inputs() {}

	function apply_to_babylon() {}

	return {
		update(state) {
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

			state.spectator.gimbal = add_to_look_vector_but_cap_vertical_axis(
				state.spectator.gimbal,
				look,
			)

		},
		dispose() {
			if (realm.plate.camera === spectator.camera)
				realm.plate.setCamera()
			spectator.dispose()
		},
	}
})

