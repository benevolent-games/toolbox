
import {Signal, signal} from "@benev/slate"
import {pubsub} from "../../tools/pubsub.js"

export class Modes<M extends keyof any> {
	#set = new Set<M>()
	#signal: Signal<M[]>

	onDisabled = pubsub<[M]>()

	constructor() {
		this.#signal = signal([])
	}

	#updateSignal() {
		this.#signal.value = [...this.#set]
	}

	;[Symbol.iterator]() {
		return this.#signal.value.values()
	}

	isEnabled(mode: M) {
		void this.#signal.value
		return this.#set.has(mode)
	}

	enable(...modes: M[]) {
		for (const mode of modes)
			this.#set.add(mode)
		this.#updateSignal()
		return this
	}

	disable(...modes: M[]) {
		modes.forEach(m => this.#set.delete(m))
		this.#updateSignal()
		modes.forEach(this.onDisabled.publish)
		return this
	}

	wipe() {
		this.#set.clear()
		this.#updateSignal()
		for (const mode of this.#set)
			this.onDisabled.publish(mode)
		return this
	}

	assign(...modes: M[]) {
		this.wipe().enable(...modes)
		this.#updateSignal()
		return this
	}
}

