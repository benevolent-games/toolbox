
import {v2, V2} from "../../utils/v2.js"

export function cap_vector_to_top_speed(vector: V2, top_speed: number) {
	return (v2.magnitude(vector) > top_speed)
		? v2.multiplyBy(v2.normalize(vector), top_speed)
		: vector
}
