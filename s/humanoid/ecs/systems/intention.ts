
import {rezzer} from "../house.js"
import {vec2} from "../../../tools/math/vec2.js"
import {get_trajectory_from_cardinals} from "../../../impulse/trajectory/get_trajectory_from_cardinals.js"

export const intention_system = rezzer(
		"intent", "sensitivity",
	)(realm => () => {

	const {impulse, stage} = realm
	const {buttons} = impulse.report.humanoid

	return {
		update(state) {
			const {sensitivity} = state

			const mouselook = vec2.multiply(
				impulse.devices.mouse.clear_movement(),
				[1, -1],
			)

			const keylook = get_trajectory_from_cardinals({
				north: buttons.up,
				south: buttons.down,
				west: buttons.left,
				east: buttons.right,
			})

			state.intent.glance = vec2.add(
				vec2.multiplyBy(keylook, sensitivity.keys),
				stage.pointerLocker.locked
					? vec2.multiplyBy(mouselook, sensitivity.mouse)
					: vec2.zero(),
			)

			state.intent.amble = get_trajectory_from_cardinals({
				north: buttons.forward,
				south: buttons.backward,
				west: buttons.leftward,
				east: buttons.rightward,
			})
		},
		dispose() {},
	}
})

