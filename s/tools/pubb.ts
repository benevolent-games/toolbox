
export function pubb<P extends any[]>() {
	const set = new Set<(...p: P) => void>()

	function subscribe(fn: (...p: P) => void) {
		set.add(fn)
	}

	subscribe.publish = (...p: P) => {
		for (const fn of set)
			fn(...p)
	}

	return subscribe
}

