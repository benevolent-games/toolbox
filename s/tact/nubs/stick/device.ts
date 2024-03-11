
import {signal} from "@benev/slate"

import {Input} from "../../types/input.js"
import {Vec2} from "../../../math/vec2.js"
import {Device} from "../../parts/device.js"
import {pubsub} from "../../../tools/pubsub.js"

export class Stick extends Device {
	onInput = pubsub<[Input.Vector]>()
	dispose = () => {}

	#channel: string
	#vector = signal<Vec2>([0, 0])

	constructor(channel: string) {
		super()
		this.#channel = channel
	}

	get vector() {
		return this.#vector.value
	}

	set vector(vector: Vec2) {
		this.#vector.value = vector
		this.onInput.publish({
			kind: "vector",
			vector,
			channel: this.#channel,
			event: null,
		})
	}
}

