
const GLOBAL = typeof window !== "undefined"
	? window
	: global

export const isNode = !("Worker" in GLOBAL)
