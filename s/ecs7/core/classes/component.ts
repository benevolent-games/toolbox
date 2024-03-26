
import {Serializable} from "../types.js"

export abstract class Component<State extends Serializable = Serializable> {
	#state: State
	#onChange: () => void

	constructor(state: State, onChange = () => {}) {
		this.#state = state
		this.#onChange = onChange
	}

	get state() {
		return this.#state
	}

	set state(s: State) {
		this.#state = s
		this.#onChange()
	}
}

