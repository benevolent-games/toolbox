
const GLOBAL = typeof window !== "undefined"
	? window
	: global

export const isNode = !("Worker" in GLOBAL)

export type Relurl = (path: string, importMetaUrl: string) => string

export const relurl = await (async(): Promise<Relurl> => {

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
