
import {Matrix, Vector2, Vector3, Vector4} from "@babylonjs/core/Maths/index.js"

type BoundingBox3 = {
	start: Vector3
	end: Vector3
}

type BoundingBox2 = {
	start: Vector2
	end: Vector2
}

type Group = {
	boundingBox: BoundingBox3
	points: Vector3[]
}

export function boxSelect({
		groups, box, projection,
	}: {
		groups: Group[]
		box: BoundingBox2
		projection: Matrix
	}): Group[] {

	return groups.filter(group => {
		const somePointsAreWithinFrustum = group.points.some(point => {
			const {x, y, z} = Vector4.TransformCoordinates(point, projection)
			const xWithinBox = x >= box.start.x && x <= box.end.x
			const yWithinBox = y >= box.start.y && y <= box.end.y
			debugger
			return xWithinBox && yWithinBox
		})
	})
}
