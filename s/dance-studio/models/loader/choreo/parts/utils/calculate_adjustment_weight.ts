
import {scalar} from "../../../../../../tools/math/scalar.js"

export function calculate_adjustment_weight(progress: number) {
	return scalar.spline.quickLinear(progress, [0, 1, 1, 0])
}

