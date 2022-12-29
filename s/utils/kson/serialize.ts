
import {nap} from "../nap.js"
import {serializationGenerator} from "./utils/serialization-generator.js"

export async function serialize(
		root: any,
		{
			onProgress = () => {},
		}: {
			onProgress?({}: {
				bytes: number,
				iterations: number,
				cycles: number,
			}): void
		} = {}
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
