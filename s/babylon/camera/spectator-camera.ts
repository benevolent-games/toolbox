
import {NubEffectEvent} from "@benev/nubs"

import {V2, v2} from "../../utils/v2.js"
import {IntegrationOptions} from "./types/integration_options.js"
import {get_user_movement_intention_from_inputs} from "./movement/get_user_movement_intention_from_inputs.js"

export function integrate_nubs_to_control_fly_camera({
	fly,
	speeds,
	nub_context,
	render_loop,
	look_sensitivity,
	}: IntegrationOptions) {

	function apply_pointer_movement(
		pointer_movement_in_pixels: V2
		) {
		fly.add_look(
			v2.multiplyBy(
				pointer_movement_in_pixels,
				look_sensitivity.pointer,
			)
		)
	}

	const dispose_pointer_listening = (
		NubEffectEvent
			.target(nub_context)
			.listen(({detail}) => {
				if (detail.kind === "pointer" && detail.effect === "look")
					if (document.pointerLockElement || detail.cause === "Lookpad")
						apply_pointer_movement(detail.movement)
			})
	)

	function simulate_movement() {
		const {key} = nub_context.effects
		fly.add_move(
			get_user_movement_intention_from_inputs({
				speeds,
				keys: {
					forward: key.forward?.pressed ?? false,
					backward: key.backward?.pressed ?? false,
					leftward: key.leftward?.pressed ?? false,
					rightward: key.rightward?.pressed ?? false,
					mosey: key.mosey?.pressed ?? false,
					sprint: key.sprint?.pressed ?? false,
				},
				stick: (
					nub_context.effects.stick.move?.vector
						?? v2.zero()
				),
			})
		)
	}

	render_loop.add(
		simulate_movement
	)

	return {
		dispose() {
			dispose_pointer_listening()
			render_loop.delete(simulate_movement)
			fly.dispose()
		}
	}
}
