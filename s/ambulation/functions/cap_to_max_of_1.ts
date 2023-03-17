
import {v2} from "../../utils/v2.js"
import {V2} from "@benev/nubs/x/tools/v2.js"

export function cap_to_max_of_1(vector: V2) {
	return (v2.magnitude(vector) > 1)
		? v2.normalize(vector)
		: vector
}
