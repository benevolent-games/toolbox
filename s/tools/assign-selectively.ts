
export function assignSelectively<T extends object>(
		standard: T,
		target: Partial<T>,
		source: Partial<T>,
	) {

	const t = target as any
	const stdkeys = Object.keys(standard)
	const tkeys = Object.keys(target)

	for (const tkey of tkeys) {
		if (!(tkey in standard))
			delete t[tkey]
	}

	for (const stdkey of stdkeys) {
		if (stdkey in source)
			t[stdkey] = (source as any)[stdkey]
	}
}

