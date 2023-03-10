import {v2, V2} from "../../../utils/v2.js"
import {cap} from "../../../utils/numpty.js"

export function lookAdd(state: {currentLook: V2}, vector: V2) {
	const radian = Math.PI / 2
	state.currentLook = v2.add(state.currentLook, vector)
	state.currentLook[1] = cap(state.currentLook[1], -radian, radian)
}
