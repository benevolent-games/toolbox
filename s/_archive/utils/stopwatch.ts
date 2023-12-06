
export function stopwatch(label: string) {
	const start = performance.now()
	return {
		log() {
			const time = (performance.now() - start).toFixed(2)
			console.log(`⏱️ ${label} ${time} ms`)
		}
	}
}
