
export type Labeler = (name: string) => string

export function labeler(tag: string) {
	let count = 0

	return function label(name: string) {
		return `${name}::${tag}::${count++}`
	}
}

