
export function timer(label: string) {
	const start = performance.now()

	return {
		report() {
			const time = performance.now() - start
			console.log(`⏱️ ${label} ${time.toFixed(2)} ms`)
		}
	}
}

export function timeAccumulator(label: string) {
	let time = 0
	let memory = 0
	return {
		start() {
			memory = performance.now()
		},
		stop() {
			const elapsed = performance.now() - memory
			time += elapsed
			memory = 0
		},
		report() {
			console.log(`⏲️ ${label} ${time.toFixed(2)} ms`)
		},
	}
}
