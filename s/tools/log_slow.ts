
let last = Date.now()

export function logSlow(ms: number, ...a: any[]) {
	const now = Date.now()
	const since = now - last

	if (since > ms) {
		last = now
		console.log(...a)
	}
}

