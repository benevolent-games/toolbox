
import {Vec2} from "../../../../tools/math/vec2.js"

export function stick_vector_to_pixels(
		radius: number | undefined,
		[x, y]: Vec2,
	): Vec2 {

	return radius !== undefined
		? [(x * radius), -(y * radius)]
		: [0, 0]
}

