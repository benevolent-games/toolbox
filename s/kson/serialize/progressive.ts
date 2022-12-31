
import {Options} from "./types/options.js"
import {serializationGenerator} from "./generator.js"

export function serializeProgressively(
		root: any,
		{onProgress = () => {}}: Options = {},
	) {

	let results: string = ""
	let iterations = 0

	const generator = serializationGenerator(root)

	for (const {cycles, bytes, chunk} of generator) {
		if (chunk)
			results += chunk

		onProgress({
			bytes,
			cycles,
			iterations: iterations++,
		})
	}

	return results
}
