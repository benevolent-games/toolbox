
import {thread} from "../threadpool/thread.js"
import {oldSerializer} from "./serialize/old-serializer.js"

thread(async(data: any) => {
	const string = oldSerializer(data)
	const encoder = new TextEncoder()
	const result = encoder.encode(string)
	const transfer = [result]
	return {result, transfer}
})
