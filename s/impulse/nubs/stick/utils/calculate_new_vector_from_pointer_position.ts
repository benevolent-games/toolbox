
import {within_radius} from "./within_radius.js"
import {Vec2} from "../../../../math/vec2.js"
import {Basis} from "../../stick-graphic/types/basis.js"
import {find_closest_point_on_circle} from "./find_closest_point_on_circle.js"

export function calculate_new_vector_from_pointer_position(
		{radius, rect: {left, top, width, height}}: Basis,
		[client_x, client_y]: Vec2,
	): Vec2 {

	const middle_x = left + (width / 2)
	const middle_y = top + (height / 2)

	let new_vector: Vec2 = [(client_x - middle_x), (client_y - middle_y)]

	if (!within_radius(radius, new_vector))
		new_vector = find_closest_point_on_circle(radius, new_vector)

	const [x, y] = new_vector
	return [(x / radius), -(y / radius)]
}
