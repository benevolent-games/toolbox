
import {Signal, clone, flatstate, pubsub, signal} from "@benev/slate"

export class Bestorage<Data extends Record<string, any>> {
	#fallbackData: Data
	#data: Signal<Data>

	onJson = pubsub<[Data]>()

	constructor(fallbackData: Data) {
		this.#fallbackData = fallbackData
		this.#data = signal(flatstate(clone(fallbackData)))
	}

	get json() {
		return JSON.stringify(this.#data.value)
	}

	set json(s: string) {
		try {
			this.#data.value = flatstate(JSON.parse(s.trim()))
		}
		catch (error) {
			this.#data.value = flatstate(clone(this.#fallbackData))
		}
		finally {
			this.onJson.publish(this.#data.value)
		}
	}

	get data() {
		return this.#data.value
	}

	set data(d: Data) {
		this.#data.value = d
	}

	pulse() {
		this.#data.publish()
	}
}

