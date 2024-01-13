
export type Labeler = (name: string) => string

let count = 0

export function label(tag: string) {
	return `${tag}::${count++}`
}

export function labeler(tag: string) {
	return (s: string) => label(`${tag}:${s}`)
}

