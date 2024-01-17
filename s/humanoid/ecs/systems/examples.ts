
import {threadable} from "../hub.js"

export const example_1 = threadable.processor("example_1")("force")
	(() => () => state => {

	state.force = state.force
})

