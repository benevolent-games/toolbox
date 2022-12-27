
export function setupKeyMap() {
	let count = 0
	const keyMap = new Map<string, number>()

	return {
		getKeyMapEntries() {
			return [...keyMap.entries()]
		},
		getKeyId(key: string) {
			let id = keyMap.get(key)
			if (id === null || id === undefined) {
				id = count++
				keyMap.set(key, id)
			}
			return id
		},
	}
}
