
import {FileData} from "./types.js"

export function fileData(file: File): FileData {
	const objectUrl = URL.createObjectURL(file)
	const revoke = () => URL.revokeObjectURL(objectUrl)
	return {
		objectUrl,
		revokeObjectUrl: revoke,
		filename: file.name,
		filesize: file.size,
	}
}

