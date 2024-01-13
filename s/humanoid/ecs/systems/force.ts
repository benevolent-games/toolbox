
import {processor} from "../house.js"
import {molasses3d} from "./utils/molasses.js"
import {vec3} from "../../../tools/math/vec3.js"

export const force_system = processor(
		"force", "intent", "smoothing", "speeds",
	)(_realm => (state, _id, tick) => {

	const {force, intent, smoothing, speeds} = state
	let [x, y, z] = intent.amble

	if (z > 0 && intent.fast) {
		x *= speeds.slow
		y *= speeds.slow
		z *= speeds.fast
	}
	else {
		const foundation_speed = (intent.slow)
			? speeds.slow
			: speeds.base

		x *= foundation_speed
		y *= foundation_speed
		z *= foundation_speed
	}

	const target = vec3.multiplyBy([x, y, z], tick.deltaTime)
	state.force = molasses3d(smoothing, force, target)
})

