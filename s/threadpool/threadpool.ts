
import {Request} from "./types/request.js"
import {isNode} from "../utils/is-node.js"
import {Response} from "./types/response.js"
import {relativeUrl} from "../utils/relative-url.js"
import {promiseParts} from "../utils/promise-parts.js"

export async function threadpool<P, R>(
		path: string,
		importMetaUrl: string,
	) {

	const url = relativeUrl(path, importMetaUrl)
	const jobs = new Map<number, (result: R) => void>()
	let id = 0

	function handleResponse({jobId, result}: Response<R>) {
		const resolve = jobs.get(jobId)

		if (!resolve)
			throw new Error(`unknown job id ${jobId}`)

		jobs.delete(jobId)
		resolve(result)
	}

	let terminate: () => void
	let request: (params: P, transfer?: Transferable[]) => Promise<R>

	if (isNode) {
		const {Worker} = await import("node:worker_threads")
		const worker = new Worker(url)

		worker.on("message", handleResponse)
		worker.on("error", err => console.error(err))
		worker.on("exit", code => console.error("exit code", code))

		request = async(params, transfer = []) => {
			const jobId = id++
			const req: Request<P> = {jobId, params}

			worker.postMessage(req)

			const {promise, resolve} = promiseParts<R>()
			jobs.set(jobId, resolve)
			return promise
		}

		terminate = () => worker.terminate()
	}

	else {
		const worker = new Worker(url)

		worker.onmessage = (
			({data: response}: MessageEvent<Response<R>>) =>
				handleResponse(response)
		)

		request = async(params, transfer = []) => {
			const jobId = id++
			const req: Request<P> = {jobId, params}

			worker.postMessage(req, transfer)

			const {promise, resolve} = promiseParts<R>()
			jobs.set(jobId, resolve)
			return promise
		}

		terminate = () => worker.terminate()
	}

	return {request, terminate}
}
