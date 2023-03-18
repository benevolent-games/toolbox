
import {NubEffectEvent} from "@benev/nubs"

import {IntegrationOptions} from "./types/integration_options.js"
import {add_user_pointer_movements_to_look} from "./utils/add_user_pointer_movements_to_look.js"
import {get_user_move_trajectory_from_keys_and_stick} from "./utils/get_user_move_trajectory_from_keys_and_stick.js"
import {get_user_look_trajectory_from_keys_and_stick} from "./utils/get_user_look_trajectory_from_keys_and_stick.js"

export function integrate_nubs_to_control_fly_camera({
		fly,
		nub_context,
		render_loop,
		look_key_speeds,
		look_sensitivity,
		move_stick_and_key_speeds,
	}: IntegrationOptions) {

	const dispose_pointer_listening = NubEffectEvent
		.target(nub_context)
		.listen(

			add_user_pointer_movements_to_look({
				effect: "look",
				is_pointer_locked: !!document.pointerLockElement,
				cause_when_pointer_not_locked: "Lookpad",
				sensitivity: look_sensitivity.pointer,
				add_look: fly.add_look,
			})
		)

	function simulate() {

		fly.add_move(
			get_user_move_trajectory_from_keys_and_stick(
				nub_context,
				move_stick_and_key_speeds,
			)
		)

		fly.add_look(
			get_user_look_trajectory_from_keys_and_stick(
				nub_context,
				look_key_speeds,
				look_sensitivity.stick,
			)
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
