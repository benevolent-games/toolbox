
import {Scene} from "@babylonjs/core/scene.js"
import {Vector3} from "@babylonjs/core/Maths/math.vector.js"
import {TargetCamera} from "@babylonjs/core/Cameras/targetCamera.js"

import {Gimbal} from "./types/gimbal.js"
import {Vec3} from "../../../tools/math/vec3.js"
import {Vec2, vec2} from "../../../tools/math/vec2.js"
import {make_camera_gear} from "./utils/make_camera_gear.js"
import {apply_look_to_gimbal} from "./utils/apply_look_to_gimbal.js"
import {add_to_look_vector_but_cap_vertical_axis} from "./utils/add_to_look_vector_but_cap_vertical_axis.js"
import {apply_movement_to_gimbal_while_considering_rotation} from "./utils/apply_movement_to_gimbal_while_considering_rotation.js"

export class Flycam {
	#look: Vec2 = vec2.zero()

	#gimbal: Gimbal
	#camera: TargetCamera

	constructor({scene, position}: {
			scene: Scene
			position: Vec3
		}) {

		const {gimbal, camera} = make_camera_gear(scene)
		this.#gimbal = gimbal
		this.#camera = camera

		gimbal.a.position = new Vector3(...position)
	}

	get camera() { return this.#camera }
	get gimbal() { return this.#gimbal }

	add_look(vector: Vec2) {
		this.#look = add_to_look_vector_but_cap_vertical_axis(
			this.#look,
			vector,
		)
		apply_look_to_gimbal(this.#look, this.#gimbal)
	}

	add_move(vector: Vec2) {
		apply_movement_to_gimbal_while_considering_rotation(
			vector,
			this.#gimbal,
		)
	}

	add_move_vertical(y: number) {
		this.#gimbal.a.position.addInPlaceFromFloats(0, y, 0)
	}

	dispose() {
		this.#gimbal.a.dispose(true)
	}
}

