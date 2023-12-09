
import {Vec2} from "../../../../tools/math/vec2.js"

export function find_closest_point_on_circle(
		radius: number,
		[x, y]: Vec2,
	): Vec2 {

	const magnitude = Math.sqrt((x ** 2) + (y ** 2))

	return [
		x / magnitude * radius,
		y / magnitude * radius,
	]
}
