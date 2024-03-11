
import {Vec2, magnitude, multiplyBy, normalize} from "../../../math/vec2.js"

export function cap_vector_to_top_speed(vector: Vec2, top_speed: number) {
	return (magnitude(vector) > top_speed)
		? multiplyBy(normalize(vector), top_speed)
		: vector
}
