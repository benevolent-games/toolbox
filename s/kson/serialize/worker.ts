
import {thread} from "../../threadpool/thread.js"
import {serializeProgressively} from "./progressive.js"

thread(async(data: any) => {
	const string = serializeProgressively(data)
	const encoder = new TextEncoder()
	const result = encoder.encode(string)
	const transfer = [result]
	return {result, transfer}
})
