
import {NubContext} from "@benev/nubs"

import {v2} from "../../../utils/v2.js"
import {Speeds} from "../../../trajectory/types/speeds.js"
import {get_trajectory_from_stick_and_cardinals} from "../../../trajectory/get_trajectory_from_stick_and_cardinals.js"

export function get_user_move_trajectory_from_keys_and_stick(
		nub_context: NubContext,
		speeds: Speeds,
	) {

	const {key, stick} = nub_context.effects

	return get_trajectory_from_stick_and_cardinals({
		speeds,

		cardinals: {
			north: key.move_forward?.pressed ?? false,
			south: key.move_backward?.pressed ?? false,
			west: key.move_leftward?.pressed ?? false,
			east: key.move_rightward?.pressed ?? false,
		},

		modifiers: {
			fast: key.move_fast?.pressed ?? false,
			slow: key.move_slow?.pressed ?? false,
		},

		stick_vector: (
			stick.move?.vector
				?? v2.zero()
		),
	})
}
