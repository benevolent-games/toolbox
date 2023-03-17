
import {v2} from "../../utils/v2.js"
import {cap_to_max_of_1} from "./cap_to_max_of_1.js"
import {MovementInputs} from "../types/movement_inputs.js"

export function get_stick_force({speeds, stick}: MovementInputs) {
	const [strafe, stride] = stick
	const capped = cap_to_max_of_1([strafe, stride])
	return v2.multiplyBy(capped, speeds.sprint)
}
