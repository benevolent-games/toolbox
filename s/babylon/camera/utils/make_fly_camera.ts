
import {Scene} from "@babylonjs/core/scene.js"

import {V3} from "../../../utils/v3.js"
import {V2, v2} from "../../../utils/v2.js"
import {Vector3} from "@babylonjs/core/Maths/math.js"
import {make_camera_gear} from "./make_camera_gear.js"
import {apply_look_to_gimbal} from "./apply_look_to_gimbal.js"
import {add_to_look_vector_but_cap_vertical_axis} from "./add_to_look_vector_but_cap_vertical_axis.js"
import {apply_movement_to_gimbal_while_considering_rotation} from "./apply_movement_to_gimbal_while_considering_rotation.js"

export function make_fly_camera({scene, position}: {
		scene: Scene
		position: V3
	}) {

	let look = v2.zero()
	const {camera, gimbal} = make_camera_gear(scene)

	gimbal.a.position = new Vector3(...position)

	return {
		camera,
		gimbal,

		add_look: (vector: V2) => {
			look = add_to_look_vector_but_cap_vertical_axis(look, vector)
			apply_look_to_gimbal(look, gimbal)
		},

		add_move: (vector: V2) => {
			apply_movement_to_gimbal_while_considering_rotation(
				vector,
				gimbal,
			)
		},
	}
}
