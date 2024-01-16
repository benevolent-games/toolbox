
import {loop} from "./loopy.js"
import {human} from "./human.js"

export function measure(fn: () => void) {
	const start = performance.now()
	fn()
	const time = performance.now() - start
	return human.performance(time)
}

export function measure_average(iterations: number, fn: (i: number) => void) {
	const warmup = 10
	const actual = iterations + warmup
	const results: number[] = []

	for (const i of loop(actual)) {
		const start = performance.now()
		fn(i)
		const time = performance.now() - start
		results.push(time)
	}

	for (const _ of loop(warmup))
		results.shift()

	let sum = 0
	for (const result of results)
		sum += result

	return `${human.performance(sum / results.length)} (${human.number(iterations)} iterations)`
}

