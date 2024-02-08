
import {pub} from "@benev/slate"

import {Input} from "../input.js"
import {Device} from "../device.js"
import {Vec2, add, zero} from "../../math/vec2.js"

export class PointerMovements extends Device {
	dispose: () => void
	movement: Vec2 = zero()
	coordinates: Vec2 = zero()

	onInput = pub<Input.Vector>()

	make_accumulator() {
		const accumulator = new MovementAccumulator(
			this.onInput(input => {
				accumulator.add(input.vector)
			})
		)
		return accumulator
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

			this.movement = add(this.movement, movement)

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

export class MovementAccumulator {
	#movement = zero()
	#dispose: () => void

	constructor(dispose: () => void) {
		this.#dispose = dispose
	}

	add(move: Vec2) {
		this.#movement = add(this.#movement, move)
	}

	steal() {
		const movement = this.#movement
		this.#movement = zero()
		return movement
	}

	dispose() {
		this.#dispose()
	}
}

