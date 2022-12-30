
import {thread} from "../../threadpool/thread.js"
import {progressiveSerialize} from "./progressive-serialize.js"

thread(async(data: any) => {
	const string = progressiveSerialize(data)
	const encoder = new TextEncoder()
	const result = encoder.encode(string)
	const transfer = [result]
	return {result, transfer}
})
