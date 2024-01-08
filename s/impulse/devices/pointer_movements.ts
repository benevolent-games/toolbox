
import {pub} from "@benev/slate"

import {Input} from "../input.js"
import {Device} from "../device.js"
import {Vec2, vec2} from "../../tools/math/vec2.js"

export class PointerMovements extends Device {
	dispose: () => void
	movement: Vec2 = vec2.zero()
	coordinates: Vec2 = vec2.zero()

	onInput = pub<Input.Vector>()

	clear_movement() {
		const {movement} = this
		this.movement = vec2.zero()
		return movement
	}

	constructor(target: EventTarget, channel: string) {
		super()

		const listener = (event: PointerEvent) => {
			this.coordinates = [
				event.clientX,
				event.clientY,
			]

			const movement: Vec2 = [
				event.movementX,
				event.movementY,
			]

			this.movement = vec2.add(this.movement, movement)

			this.onInput.publish({
				kind: "vector",
				vector: movement,
				channel,
			})
		}

		target.addEventListener("pointermove", listener as any)

		this.dispose = () => {
			target.removeEventListener("pointermove", listener as any)
		}
	}
}

