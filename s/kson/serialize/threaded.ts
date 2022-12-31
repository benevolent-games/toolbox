
import {threadpool} from "../../threadpool/threadpool.js"

export async function threadedSerializer() {

	const {request, terminate} = (
		await threadpool<any, Uint8Array>(
			"./serialize/serialize.worker.js",
			import.meta.url,
		)
	)

	return {
		terminate,
		async serialize(data: any) {
			const binary = await request(data)
			const decoder = new TextDecoder()
			return decoder.decode(binary)
		},
	}
}
