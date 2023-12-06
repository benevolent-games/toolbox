
import {Vector3} from "@babylonjs/core/Maths/index.js"
import {BoxSelectOptions} from "./box-select/types/box-select-options.js"
import {filterForPointsWithinBox} from "./box-select/filter-for-points-within-box.js"

export function boxSelect({
		box,
		points,
		transform,
	}: BoxSelectOptions): Vector3[] {

	return points.filter(
		filterForPointsWithinBox(box, transform)
	)
}
