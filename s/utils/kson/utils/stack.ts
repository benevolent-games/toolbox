
export class Stack<T = any> {

	#memory: T[] = []

	get size() {
		return this.#memory.length
	}

	get memory() {
		return [...this.#memory]
	}

	push(...t: T[]) {
		this.#memory.push(...t)
	}

	pushReverse(...t: T[]) {
		t.reverse()
		this.#memory.push(...t)
	}

	pop() {
		return this.#memory.pop()
	}

	clear() {
		this.#memory = []
	}
}
