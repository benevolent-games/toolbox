
export function timekeeper() {
	const map = new Map<string, number>()

	const clocks = <{[key: string]: () => void}>new Proxy({}, {
		get(t, p: string) {
			const start = performance.now()
			return () => {
				const elapsed = performance.now() - start
				const accumulated = map.get(p) ?? 0
				map.set(p, accumulated + elapsed)
			}
		}
	})

	return {
		clocks,
		report() {
			for (const [clock, milliseconds] of map)
				console.log(`⏱️ ${clock} ${milliseconds.toFixed(2)} ms`)
		},
	}
}
