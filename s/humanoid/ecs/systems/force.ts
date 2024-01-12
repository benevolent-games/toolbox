
import {rezzer} from "../house.js"

export const force_system = rezzer("intent", "force")(realm => init => {

	return {
		update(state) {
			// state.force = molasses2d(10 / 100, state.force, state.intent)
		},
		dispose() {},
	}
})

