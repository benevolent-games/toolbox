
export class Dictionary {
	#count = 0
	#keyMap = new Map<string, number>()

	getKeyMapEntries() {
		return [...this.#keyMap.entries()]
	}

	getKeyId(key: string) {
		let id = this.#keyMap.get(key)
		if (id === null || id === undefined) {
			id = this.#count++
			this.#keyMap.set(key, id)
		}
		return id
	}
}
