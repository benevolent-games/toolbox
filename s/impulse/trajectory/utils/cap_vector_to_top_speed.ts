
import {Vec2, vec2} from "../../../tools/math/vec2.js"

export function cap_vector_to_top_speed(vector: Vec2, top_speed: number) {
	return (vec2.magnitude(vector) > top_speed)
		? vec2.multiplyBy(vec2.normalize(vector), top_speed)
		: vector
}
