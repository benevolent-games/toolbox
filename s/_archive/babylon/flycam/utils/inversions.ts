
import {V2, v2} from "../../../utils/v2.js"

export const y_inverter: V2 = [1, -1]
export const x_inverter: V2 = [-1, 1]

export function invert_y_axis(vector: V2) {
	return v2.multiply(vector, y_inverter)
}

export function invert_x_axis(vector: V2) {
	return v2.multiply(vector, x_inverter)
}
