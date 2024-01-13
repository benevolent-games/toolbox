
import {processor} from "../house.js"
import {molasses3d} from "./utils/molasses.js"

export const force_system = processor("force", "intent", "smoothing")(() => state => {
	state.force = molasses3d(1 / state.smoothing, state.force, state.intent.amble)
})

