
import {isNode} from "./is-node.js"

export type RelativeUrl = (path: string, importMetaUrl: string) => string

export const relativeUrl = await (async(): Promise<RelativeUrl> => {

	if (isNode) {
		const {dirname, normalize} = await import("path")
		const {fileURLToPath} = await import("url")
		return (path: string, importMetaUrl: string) => {
			const dir = dirname(fileURLToPath(importMetaUrl))
			return normalize(dir + "/" + path)
		}
	}

	else
		return (path: string) => path

})()
