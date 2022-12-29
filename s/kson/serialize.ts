
import {Options} from "./serialize/types/options.js"
import {serializationGenerator} from "./serialize/serialization-generator.js"
import {promiseParts} from "../utils/promise-parts.js"
import {WorkerResponse} from "./serialize/types/worker-response.js"
import {pool} from "../threadpool/pool.js"
import {relurl} from "../threadpool/utils/is-node.js"

export function serialize(
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

export async function makeSerializer() {
	const url = relurl("./serialize.worker.js", import.meta.url)
	const {request, terminate} = await pool<any, Uint8Array>(url)

	return {
		terminate,
		async serialize(data: any) {
			const binary = await request(data)
			const decoder = new TextDecoder()
			return decoder.decode(binary)
		},
	}
}

export class Serializer {
	#id = 0
	#worker = new Worker("./serialize.worker.js")
	#jobs = new Map<number, (text: string) => void>()

	#handleResponse({jobId, binary}: WorkerResponse) {
		const decoder = new TextDecoder()
		const text = decoder.decode(binary)
		const resolve = this.#jobs.get(jobId)
		if (!resolve)
			throw new Error(`unknown job ${jobId}`)
		this.#jobs.delete(jobId)
		resolve(text)
	}

	constructor() {
		this.#worker.onmessage = (
			(message: MessageEvent<WorkerResponse>) =>
				this.#handleResponse(message.data)
		)
	}

	async serialize(data: any) {
		const jobId = this.#id++
		const {promise, resolve} = promiseParts<string>()
		this.#jobs.set(jobId, resolve)
		this.#worker.postMessage({
			jobId,
			data,
		})
		return promise
	}
}
