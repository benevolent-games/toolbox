
import {threadable} from "../hub.js"
import {vec3} from "../../../tools/math/vec3.js"

export const velocity_calculator_system = threadable.lifecycle(
		"position",
		"velocity",
	)(() => () => {

	let previous_position = vec3.zero()

	return {
		update(_tick, state) {
			state.velocity = vec3.subtract(state.position, previous_position)
			previous_position = state.position
		},
		dispose() {},
	}
})

