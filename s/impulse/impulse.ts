
import {Pub, flat, ob, pub} from "@benev/slate"

import {Input} from "./input.js"
import {Device} from "./device.js"
import {Modes} from "./modes.js"
import {Binds, Mode} from "./binds.js"
import {Keyboard} from "./devices/keyboard.js"
import {Vec2, vec2} from "../tools/math/vec2.js"
import {PointerButtons} from "./devices/pointer_buttons.js"
import {PointerMovements} from "./devices/pointer_movements.js"
import {input_matches_button, input_matches_vector} from "./parts/matching.js"

export class Impulse<B extends Binds> {
	static Keyboard = Keyboard
	static PointerButtons = PointerButtons
	static PointerMovements = PointerMovements

	#devices = new Map<Device, () => void>()

	binds: B
	readonly modes: Modes<Mode<B>>

	readonly report: {
		[M in keyof B]: {
			buttons: {[P in keyof B[M]["buttons"]]: boolean}
			vectors: {[P in keyof B[M]["vectors"]]: Vec2}
		}
	}

	readonly on: {
		[M in keyof B]: {
			buttons: {[P in keyof B[M]["buttons"]]: Pub<Input.Button>}
			vectors: {[P in keyof B[M]["vectors"]]: Pub<Input.Vector>}
		}
	}

	constructor({binds, devices = [], modes = []}: {
			binds: B
			devices?: Device[]
			modes?: Mode<B>[]
		}) {

		this.modes = new Modes<Mode<B>>()
		this.binds = binds
		this.add(...devices)

		this.modes.assign(...modes)

		this.report = ob(binds).map(
			({buttons, vectors}) => ({
				buttons: flat.state(ob(buttons).map(() => false)) as any,
				vectors: flat.state(ob(vectors).map(() => vec2.zero())) as any,
			}),
		)

		this.on = ob(binds).map(
			({buttons, vectors}) => ({
				buttons: ob(buttons).map(() => pub()) as any,
				vectors: ob(vectors).map(() => pub()) as any,
			}),
		)
	}

	readonly input = (input: Input.Whatever) => {
		for (const mode of this.modes) {
			switch (input.kind) {
				case "button":
					for (const [name, btns] of Object.entries(this.binds[mode].buttons)) {
						if (input_matches_button(input, btns)) {
							;(this.report[mode].buttons as any)[name] = input.down
							this.on[mode].buttons[name].publish(input)
						}
					}
					break
				case "vector":
					for (const [name, channels] of Object.entries(this.binds[mode].vectors)) {
						if (input_matches_vector(input, channels)) {
							;(this.report[mode].vectors as any)[name] = input.vector
							this.on[mode].vectors[name].publish(input)
						}
					}
					break
			}
		}
	}

	add(...devices: Device[]) {
		for (const device of devices)
			if (!this.#devices.has(device))
				this.#devices.set(device, device.onInput(this.input))
		return this
	}

	remove(...devices: Device[]) {
		for (const device of devices) {
			const stop = this.#devices.get(device)
			if (stop) {
				stop()
				this.#devices.delete(device)
			}
		}
		return this
	}

	clear() {
		for (const device of [...this.#devices.keys()])
			this.remove(device)
		return this
	}
}

