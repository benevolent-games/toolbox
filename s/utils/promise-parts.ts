
export interface PromiseParts<T> {
	promise: Promise<T>
	resolve: (result: T) => void
	reject: (reason: any) => void
}

export function promiseParts<T>(): PromiseParts<T> {
	const parts = <PromiseParts<T>><any>{
		promise: undefined,
		resolve: undefined,
		reject: undefined,
	}

	parts.promise = new Promise((res, rej) => {
		parts.resolve = res
		parts.reject = rej
	})

	return parts
}
