
export class Constrained<X> {
	#value: X
	#constraint: (value: X) => X

	constructor(value: X, constraint: (value: X) => X) {
		this.#value = value
		this.#constraint = constraint
	}

	get value() {
		return this.#value
	}

	set value(value: X) {
		this.#value = this.#constraint(value)
	}
}

