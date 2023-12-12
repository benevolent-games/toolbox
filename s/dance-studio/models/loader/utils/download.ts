
import {Download, FileData} from "./types.js"

export function download(url: string): Download {
	const filename = new URL(url).pathname.split("/").at(-1) ?? "unknown"
	const abortController = new AbortController()
	const abort = () => abortController.abort()

	const promise = fetch(url, {signal: abortController.signal})
		.then(response => {
			if (!response.ok)
				throw new Error(`failed to load "${filename}"`)
			return response
		})
		.then(response => response.blob())
		.then(blob => {
			const objectUrl = URL.createObjectURL(blob)
			const data: FileData = {
				objectUrl,
				filename,
				filesize: blob.size,
				revokeObjectUrl: () => URL.revokeObjectURL(objectUrl),
			}
			return data
		})
		.catch(error => {
			if (error.name === "AbortError")
				return null
			else
				throw error
		})

	return {abort, promise}
}

