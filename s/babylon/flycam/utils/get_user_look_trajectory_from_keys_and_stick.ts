
import {NubContext} from "@benev/nubs"

import {v2} from "../../../utils/v2.js"
import {Speeds} from "../../../trajectory/types/speeds.js"
import {get_trajectory_from_cardinals} from "../../../trajectory/get_trajectory_from_cardinals.js"
import {select_speed_based_on_modifiers} from "../../../trajectory/utils/select_speed_based_on_modifiers.js"

export function get_user_look_trajectory_from_keys_and_stick(
		nub_context: NubContext,
		speeds: Speeds,
		stick_sensitivity: number,
	) {

	const {key, stick} = nub_context.effects

	const cardinals = {
		north: key.look_up?.pressed ?? false,
		south: key.look_down?.pressed ?? false,
		west: key.look_left?.pressed ?? false,
		east: key.look_right?.pressed ?? false,
	}

	const modifiers = {
		fast: key.look_fast?.pressed ?? false,
		slow: key.look_slow?.pressed ?? false,
	}

	const stick_vector = (
		stick.look?.vector
			?? v2.zero()
	)

	const cardinal_is_scaled_based_on_modifiers = v2.multiplyBy(
		get_trajectory_from_cardinals(cardinals),
		select_speed_based_on_modifiers(modifiers, speeds),
	)

	const stick_is_scaled_by_sensitivity = v2.multiplyBy(
		stick_vector,
		stick_sensitivity,
	)

	return v2.add(
		cardinal_is_scaled_based_on_modifiers,
		stick_is_scaled_by_sensitivity,
	)
}
