
export type Labeler = (name: string) => string

let count = 0

export function labeler(tag: string): Labeler {
	return function label(name: string) {
		return `${name}::${tag}::${count++}`
	}
}

