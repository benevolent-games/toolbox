
import {Movements} from "./movements.js"
import {Vec2, add} from "../../math/vec2.js"

export class PointerMovements extends Movements {
	constructor(target: EventTarget, channel: string) {
		super(channel)

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
			this.dispatch({event, vector: movement})
		}

		target.addEventListener("pointermove", listener as any)

		this.dispose = () => {
			target.removeEventListener("pointermove", listener as any)
		}
	}
}

