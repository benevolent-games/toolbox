
import {V2, v2} from "../utils/v2.js"
import {TrajectoryInputs} from "./types/trajectory_inputs.js"
import {get_vector_from_cardinals} from "./utils/get_vector_from_cardinals.js"
import {cap_vector_to_top_speed} from "./utils/cap_vector_to_top_speed.js"

export function get_trajectory_from_user_inputs({
		stick_vector,
		cardinals,
		modifiers,
		speeds,
	}: TrajectoryInputs): V2 {

	const speed = (
		modifiers.fast
			? speeds.fast
			: modifiers.slow
				? speeds.slow
				: speeds.base
	)

	const cardinal_is_scaled_based_on_modifiers = v2.multiplyBy(
		get_vector_from_cardinals(cardinals),
		speed,
	)

	const stick_is_always_scaled_to_top_speed = v2.multiplyBy(
		stick_vector,
		speeds.fast,
	)

	return cap_vector_to_top_speed(
		v2.add(
			cardinal_is_scaled_based_on_modifiers,
			stick_is_always_scaled_to_top_speed,
		),
		speeds.fast,
	)
}
