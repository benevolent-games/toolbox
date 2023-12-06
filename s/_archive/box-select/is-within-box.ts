
import {Vector3} from "@babylonjs/core/Maths/math.js"
import {BoundingBox2} from "./types/bounding-box-2.js"

export function isWithinBox(
		{x, y}: Vector3,
		box: BoundingBox2,
	) {

	const xWithinBox = x >= box.start.x && x <= box.end.x
	const yWithinBox = y >= box.start.y && y <= box.end.y

	return xWithinBox && yWithinBox
}
