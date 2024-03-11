
import {Vec2, multiplyBy, add} from "../../math/vec2.js"
import {TrajectoryInputs} from "./types/trajectory_inputs.js"
import {cap_vector_to_top_speed} from "./utils/cap_vector_to_top_speed.js"
import {get_trajectory_from_cardinals} from "./get_trajectory_from_cardinals.js"
import {select_speed_based_on_modifiers} from "./utils/select_speed_based_on_modifiers.js"

export function get_trajectory_from_stick_and_cardinals({
		speeds,
		cardinals,
		modifiers,
		stick_vector,
	}: TrajectoryInputs): Vec2 {

	const cardinal_is_scaled_based_on_modifiers = multiplyBy(
		get_trajectory_from_cardinals(cardinals),
		select_speed_based_on_modifiers(modifiers, speeds),
	)

	const stick_is_always_scaled_to_top_speed = multiplyBy(
		stick_vector,
		speeds.fast,
	)

	return cap_vector_to_top_speed(
		add(
			cardinal_is_scaled_based_on_modifiers,
			stick_is_always_scaled_to_top_speed,
		),
		speeds.fast,
	)
}
