
import {v2} from "../utils/v2.js"
import {MovementInputs} from "./types/movement_inputs.js"
import {cap_top_speed} from "./functions/cap_top_speed.js"
import {get_stick_force} from "./functions/get_stick_force.js"
import {get_keyboard_force} from "./functions/get_keyboard_force.js"

export function get_user_movement_intention_from_inputs(
	inputs: MovementInputs
	) {

	const user_intended_movement = v2.add(
		get_keyboard_force(inputs),
		get_stick_force(inputs),
	)

	return cap_top_speed(
		user_intended_movement,
		inputs.speeds.sprint,
	)
}
