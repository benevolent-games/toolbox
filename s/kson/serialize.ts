
import {nap} from "../utils/nap.js"
import {Options} from "./serialize/types/options.js"
import {serializationGenerator} from "./serialize/serialization-generator.js"

export async function serialize(
		root: any,
		{onProgress = () => {}}: Options = {}
	) {

	let results: string = ""
	let iterations = 0

	for (const {cycles, bytes, chunk} of serializationGenerator(root)) {
		if (chunk)
			results += chunk

		onProgress({
			bytes,
			cycles,
			iterations: iterations++,
		})

		await nap()
	}

	return results
}
