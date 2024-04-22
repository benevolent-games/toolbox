
import {Signal, clone, signal} from "@benev/slate"

export class Bestorage<Data extends Record<string, any>> {
	#fallbackData: Data
	#data: Signal<Data>

	constructor(fallbackData: Data) {
		this.#fallbackData = fallbackData
		this.#data = signal(clone(fallbackData))
	}

	get json() {
		return JSON.stringify(this.#data.value)
	}

	set json(s: string) {
		console.log("set json")
		try {
			this.#data.value = JSON.parse(s.trim())
		}
		catch (error) {
			this.#data.value = clone(this.#fallbackData)
		}
	}

	get data() {
		return this.#data.value
	}

	set data(d: Data) {
		console.log("set data")
		this.#data.value = d
	}

	pulse() {
		this.#data.publish()
	}
}

