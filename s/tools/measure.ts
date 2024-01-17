
export function measure(fn: () => void) {
	const start = performance.now()
	fn()
	return performance.now() - start
}

