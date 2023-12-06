
import {isWithinBox} from "./is-within-box.js"
import {BoundingBox2} from "./types/bounding-box-2.js"
import {standardViewport} from "./standard-viewport.js"
import {Matrix, Vector3} from "@babylonjs/core/Maths/math.js"

export function filterForPointsWithinBox(
		box: BoundingBox2,
		transform: Matrix,
	) {

	const viewport = standardViewport()
	const identity = Matrix.Identity()

	return (point: Vector3) => {

		const coordinates = Vector3.Project(
			point,
			identity,
			transform,
			viewport,
		)

		return isWithinBox(coordinates, box)
	}
}
