
import {Device} from "./device.js"
import {Input} from "../types/input.js"

export class Devices {
	#map = new Map<Device, () => void>()
	#onInput: (input: Input.Whatever) => void

	constructor(considerInput: (input: Input.Whatever) => void) {
		this.#onInput = considerInput
	}

	add(...devices: Device[]) {
		for (const device of devices)
			if (!this.#map.has(device))
				this.#map.set(device, device.onInput(this.#onInput))
		return this
	}

	remove(...devices: Device[]) {
		for (const device of devices) {
			const stop = this.#map.get(device)
			if (stop) {
				stop()
				this.#map.delete(device)
			}
		}
		return this
	}

	clear() {
		for (const device of [...this.#map.keys()])
			this.remove(device)
		return this
	}
}

