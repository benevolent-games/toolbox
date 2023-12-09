
import {Vec2} from "./math/vec2.js"

export function coordinates_in_rect(
		coordinates: Vec2,
		rect: DOMRect,
	): Vec2 | null {

	const [clientX, clientY] = coordinates
	const x = clientX - rect.left
	const y = clientY - rect.top

	const withinX = (x >= 0) && (x <= rect.width)
	const withinY = (y >= 0) && (y <= rect.height)
	const within = withinX && withinY

	return within
		? [x, y]
		: null
}

