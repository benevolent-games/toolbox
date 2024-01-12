
import {rezzer} from "../house.js"
import {vec3} from "../../../tools/math/vec3.js"

export const velocity_calculator_system = rezzer("position", "velocity")(() => () => {
	let previous_position = vec3.zero()
	return {
		update(state) {
			state.velocity = vec3.subtract(state.position, previous_position)
			previous_position = state.position
		},
		dispose() {},
	}
})

