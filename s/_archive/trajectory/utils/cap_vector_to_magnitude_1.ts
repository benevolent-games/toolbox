
import {v2, V2} from "../../utils/v2.js"

export function cap_vector_to_magnitude_1(vector: V2) {
	return (v2.magnitude(vector) > 1)
		? v2.normalize(vector)
		: vector
}
