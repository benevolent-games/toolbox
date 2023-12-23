
import {HumanoidImpulse} from "../../../models/impulse/impulse.js"
import {get_trajectory_from_cardinals} from "../../../../impulse/trajectory/get_trajectory_from_cardinals.js"

export function gather_input_vectors(impulse: HumanoidImpulse) {
	const {buttons} = impulse.report.humanoid
	const move = get_trajectory_from_cardinals({
		north: buttons.forward,
		south: buttons.backward,
		east: buttons.rightward,
		west: buttons.leftward,
	})
	const look = get_trajectory_from_cardinals({
		north: buttons.up,
		south: buttons.down,
		east: buttons.right,
		west: buttons.left,
	})
	return {move, look}
}

