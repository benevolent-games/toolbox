
import {Cardinals} from "./types/cardinals.js"
import {cap_vector_to_magnitude_1} from "./utils/cap_vector_to_magnitude_1.js"

export function get_trajectory_from_cardinals(cardinals: Cardinals) {
	let stride = 0
	let strafe = 0

	if (cardinals.north)
		stride += 1

	if (cardinals.south)
		stride -= 1

	if (cardinals.west)
		strafe -= 1

	if (cardinals.east)
		strafe += 1

	return cap_vector_to_magnitude_1([strafe, stride])
}
