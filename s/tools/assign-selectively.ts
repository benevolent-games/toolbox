
export function assignSelectively<T extends object>(standard: T, target: Partial<T>, ...sources: Partial<T>[]) {
	const keys = Object.keys(standard)
	for (const source of sources) {
		for (const key of keys) {
			if (key in source) {
				(target as any)[key] = (source as any)[key]
			}
		}
	}
}

