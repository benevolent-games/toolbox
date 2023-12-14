
import {Vec2, vec2} from "../../../tools/math/vec2.js"

export function cap_vector_to_magnitude_1(vector: Vec2) {
	return (vec2.magnitude(vector) > 1)
		? vec2.normalize(vector)
		: vector
}
