
import {BoundingBox3} from "./bounding-box-3.js"
import {Vector3} from "@babylonjs/core/Maths/math.vector.js"

export type Group = {
	boundingBox: BoundingBox3
	points: Vector3[]
}
