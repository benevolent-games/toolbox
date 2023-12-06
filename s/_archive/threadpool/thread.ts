
import {Parcel} from "./types/parcel.js"
import {isNode} from "../utils/is-node.js"
import {Request} from "./types/request.js"
import {Response} from "./types/response.js"

export async function thread<P, R>(
		doWork: (params: P) => Promise<Parcel<R>>,
	) {

	if (isNode) {
		const {parentPort} = await import("node:worker_threads")

		if (!parentPort)
			throw new Error("ahck!")

		parentPort.on("message", async({jobId, params}: Request<P>) => {
			const {result, transfer = []} = await doWork(params)
			const response: Response<R> = {jobId, result}
			parentPort.postMessage(response)
		})
	}

	else {
		onmessage = async(
				{data: {jobId, params}}: MessageEvent<Request<P>>
			) => {
			const {result, transfer = []} = await doWork(params)
			const response: Response<R> = {jobId, result}
			postMessage(response, transfer)
		}
	}
}
