
import {Vec2, magnitude, normalize} from "../../../math/vec2.js"

export function cap_vector_to_magnitude_1(vector: Vec2) {
	return (magnitude(vector) > 1)
		? normalize(vector)
		: vector
}
