
import {Scene} from "@babylonjs/core/scene.js"
import {Vector3} from "@babylonjs/core/Maths/math.js"

import {Vec3} from "../../../tools/math/vec3.js"
import {Vec2, vec2} from "../../../tools/math/vec2.js"
import {make_camera_gear} from "./utils/make_camera_gear.js"
import {apply_look_to_gimbal} from "./utils/apply_look_to_gimbal.js"
import {add_to_look_vector_but_cap_vertical_axis} from "./utils/add_to_look_vector_but_cap_vertical_axis.js"
import {apply_movement_to_gimbal_while_considering_rotation} from "./utils/apply_movement_to_gimbal_while_considering_rotation.js"

export function make_fly_camera({scene, position}: {
		scene: Scene
		position: Vec3
	}) {

	let look = vec2.zero()

	const {camera, gimbal} = make_camera_gear(scene)
	gimbal.a.position = new Vector3(...position)

	return {
		camera,
		gimbal,

		add_look(vector: Vec2) {
			look = add_to_look_vector_but_cap_vertical_axis(look, vector)
			apply_look_to_gimbal(look, gimbal)
		},

		add_move(vector: Vec2) {
			apply_movement_to_gimbal_while_considering_rotation(
				vector,
				gimbal,
			)
		},

		add_move_vertical(y: number) {
			gimbal.a.position.addInPlaceFromFloats(0, y, 0)
		},

		dispose() {
			gimbal.a.dispose(true)
		}
	}
}

