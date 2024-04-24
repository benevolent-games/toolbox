
import {Signal, clone, flatstate, pubsub, signal} from "@benev/slate"

export class Bestorage<Data extends Record<string, any>> {
	#data: Signal<Data>
	onJson = pubsub<[Data]>()

	constructor(public fallback: Data) {
		this.#data = signal(flatstate(clone(fallback)))
	}

	get json() {
		return JSON.stringify(this.#data.value)
	}

	set json(s: string) {
		try {
			this.#data.value = flatstate(JSON.parse(s.trim()))
		}
		catch (error) {
			this.#data.value = flatstate(clone(this.fallback))
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

