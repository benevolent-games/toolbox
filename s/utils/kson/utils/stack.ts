
export class Stack<T = any> {

	#memory: T[] = []

	get size() {
		return this.#memory.length
	}

	get memory() {
		return [...this.#memory]
	}

	push(t: T[]) {
		for (const item of t)
			this.#memory.push(item)
	}

	pushReverse(t: T[]) {
		const reversed = <T[]>t.slice().reverse()
		this.push(reversed)
	}

	pop() {
		return this.#memory.pop()
	}

	clear() {
		this.#memory = []
	}
}
