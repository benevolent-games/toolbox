
import {scalar} from "../../../../tools/math/scalar.js"
import {Vec2, vec2} from "../../../../tools/math/vec2.js"

const radian = Math.PI / 2

export function add_to_look_vector_but_cap_vertical_axis(
		look: Vec2,
		addition: Vec2,
	) {

	const result = vec2.add(look, addition)

	result[1] = scalar.cap(result[1], -radian, radian)

	return result
}

