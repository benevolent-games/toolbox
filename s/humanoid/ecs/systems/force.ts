
import {processor} from "../house.js"
import {molasses3d} from "./utils/molasses.js"
import {vec3} from "../../../tools/math/vec3.js"

export const force_system = processor(
		"force", "intent", "smoothing", "speeds",
	)(_realm => (state, _id, tick) => {

	const {force, intent, smoothing, speeds} = state
	const [x, y, z] = intent.amble

	let cool = vec3.zero()

	if (z > 0 && intent.fast) {
		cool = vec3.multiplyBy(
			vec3.normalize([
				x / 2,
				y / 2,
				z,
			]),
			speeds.fast,
		)
	}
	else {
		const foundation_speed = (intent.slow)
			? speeds.slow
			: speeds.base
		cool = vec3.multiplyBy(intent.amble, foundation_speed)
	}

	const target = vec3.multiplyBy(cool, tick.deltaTime)
	state.force = molasses3d(smoothing, force, target)
})

