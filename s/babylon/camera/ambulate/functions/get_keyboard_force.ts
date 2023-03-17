
import {v2} from "../../../../utils/v2.js"
import {cap_to_max_of_1} from "./cap_to_max_of_1.js"
import {MovementInputs} from "../types/movement_inputs.js"

export function get_keyboard_force({keys, speeds}: MovementInputs) {
	let stride = 0
	let strafe = 0

	if (keys.forward) stride += 1
	if (keys.backward) stride -= 1
	if (keys.leftward) strafe -= 1
	if (keys.rightward) strafe += 1

	const capped = cap_to_max_of_1([strafe, stride])

	const speed = keys.sprint
		? speeds.sprint
		: keys.mosey
			? speeds.mosey
			: speeds.walk

	return v2.multiplyBy(capped, speed)
}
