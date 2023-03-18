
import {NubEffectEvent} from "@benev/nubs"

import {IntegrationOptions} from "./types/integration_options.js"
import {add_user_pointer_movements_to_look} from "./utils/add_user_pointer_movements_to_look.js"
import {get_user_vertical_movement_based_on_keys} from "./utils/get_user_vertical_movement_based_on_keys.js"
import {get_user_move_trajectory_from_keys_and_stick} from "./utils/get_user_move_trajectory_from_keys_and_stick.js"
import {get_user_look_trajectory_from_keys_and_stick} from "./utils/get_user_look_trajectory_from_keys_and_stick.js"

export function integrate_nubs_to_control_fly_camera({
		fly,
		nub_context,
		render_loop,
		look_sensitivity,
		speeds_for_movement,
		speeds_for_looking_with_keys_and_stick,
	}: IntegrationOptions) {

	const dispose_pointer_listening = NubEffectEvent
		.target(nub_context)
		.listen(

			add_user_pointer_movements_to_look({
				effect: "look",
				sensitivity: look_sensitivity.pointer,
				cause_to_use_when_pointer_not_locked: "Lookpad",
				add_look: fly.add_look,
				is_pointer_locked: () => !!document.pointerLockElement,
			})
		)

	function simulate() {
		fly.add_look(
			get_user_look_trajectory_from_keys_and_stick(
				nub_context,
				speeds_for_looking_with_keys_and_stick,
				look_sensitivity.stick,
			)
		)

		fly.add_move(
			get_user_move_trajectory_from_keys_and_stick(
				nub_context,
				speeds_for_movement,
			)
		)

		fly.add_move_vertical(
			get_user_vertical_movement_based_on_keys(
				nub_context,
				speeds_for_movement,
			),
		)
	}

	render_loop.add(simulate)

	return {
		camera: fly.camera,
		gimbal: fly.gimbal,
		dispose() {
			dispose_pointer_listening()
			render_loop.delete(simulate)
			fly.dispose()
		}
	}
}
