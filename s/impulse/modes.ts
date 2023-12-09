
import {Signal, signal} from "@benev/slate"

export class Modes<M extends keyof any> {
	#set = new Set<M>()
	#signal: Signal<M[]>

	constructor() {
		this.#signal = signal([])
	}

	#updateSignal() {
		this.#signal.value = [...this.#set]
	}

	#pokeSignal() {
		void this.#signal.value
	}

	;[Symbol.iterator]() {
		this.#pokeSignal()
		return this.#signal.value.values()
	}

	isEnabled(mode: M) {
		this.#pokeSignal()
		return this.#set.has(mode)
	}

	enable(...modes: M[]) {
		for (const mode of modes)
			this.#set.add(mode)
		this.#updateSignal()
		return this
	}

	disable(...modes: M[]) {
		for (const mode of modes)
			this.#set.delete(mode)
		this.#updateSignal()
		return this
	}

	wipe() {
		this.#set.clear()
		this.#updateSignal()
		return this
	}

	assign(...modes: M[]) {
		this.wipe().enable(...modes)
		this.#updateSignal()
		return this
	}
}

