
export function makeStore<X>(storage: Storage, key: string) {
	return {

		save(value: X) {
			const data = JSON.stringify(value)
			storage.setItem(key, data)
		},

		load(): X | undefined {
			try {
				const data = storage.getItem(key)
				return data
					? JSON.parse(data)
					: undefined
			}
			catch (error) {
				return undefined
			}
		},
	}
}
