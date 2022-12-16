
import {BoundingBox2} from "./bounding-box-2.js"
import {Matrix, Vector3} from "@babylonjs/core/Maths/math.vector.js"

export interface BoxSelectOptions {
	box: BoundingBox2
	points: Vector3[]
	transform: Matrix
}
