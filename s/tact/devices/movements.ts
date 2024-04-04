
import {Input} from "../types/input.js"
import {Device} from "../parts/device.js"
import {pubsub} from "../../tools/pubsub.js"
import {Vec2, zero} from "../../math/vec2.js"
import {MovementAccumulator} from "./utils/movement_accumulator.js"

export class Movements extends Device {
	movement: Vec2 = zero()
	coordinates: Vec2 = zero()

	onInput = pubsub<[Input.Vector]>()
	dispose = () => {}

	constructor(public readonly channel: string) {
		super()
	}

	make_accumulator() {
		const accumulator = new MovementAccumulator(
			this.onInput(input => void accumulator.add(input.vector))
		)
		return accumulator
	}

	dispatch({vector, event}: {
			vector: Vec2
			event: PointerEvent
		}) {
		this.onInput.publish({
			event,
			vector,
			kind: "vector",
			channel: this.channel,
		})
	}
}

