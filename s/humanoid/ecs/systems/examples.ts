
import {threadable} from "../hub.js"

export const example_1 = threadable.processor("force")
	(() => () => state => {

	state.force = state.force
})

