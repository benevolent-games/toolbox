
import {v2} from "../../../utils/v2.js"
import {cap} from "../../../utils/numpty.js"
import {V2} from "@benev/nubs/x/tools/v2.js"

const radian = Math.PI / 2

export function add_to_look_vector_but_cap_vertical_axis(
	look: V2,
	addition: V2,
	) {

	const result = v2.add(look, addition)
	result[1] = cap(look[1], -radian, radian)
	return result
}
