
import {mainthread} from "../hub.js"
import {Vec3} from "../../../tools/math/vec3.js"
import {Vec2, vec2} from "../../../tools/math/vec2.js"
import {get_trajectory_from_cardinals} from "../../../impulse/trajectory/get_trajectory_from_cardinals.js"

export const intention_system = mainthread.lifecycle(
		"intent",
		"sensitivity",
	)(realm => () => {

	const {impulse, stage} = realm
	const {buttons} = impulse.report.humanoid
	const mouseMovement = impulse.devices.mouse.make_accumulator()
	const invert_y_axis = (v: Vec2) => vec2.multiply(v, [1, -1])

	return {
		update(_tick, state) {
			const {sensitivity} = state

			const mouselook = invert_y_axis(mouseMovement.steal())

			const keylook = get_trajectory_from_cardinals({
				north: buttons.up,
				south: buttons.down,
				west: buttons.left,
				east: buttons.right,
			})

			const glance = vec2.add(
				vec2.multiplyBy(keylook, sensitivity.keys),
				stage.pointerLocker.locked
					? vec2.multiplyBy(mouselook, sensitivity.mouse)
					: vec2.zero(),
			)

			const [x, z] = get_trajectory_from_cardinals({
				north: buttons.forward,
				south: buttons.backward,
				west: buttons.leftward,
				east: buttons.rightward,
			})

			const amble: Vec3 = [x, 0, z]

			state.intent = {
				amble,
				glance,
				fast: impulse.report.humanoid.buttons.fast,
				slow: impulse.report.humanoid.buttons.slow,
			}
		},
		dispose() {
			mouseMovement.dispose()
		},
	}
})

