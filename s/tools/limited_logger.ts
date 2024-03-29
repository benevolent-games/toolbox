
export function make_limited_logger(n: number) {
	let count = 0

	return function log(...args: any[]) {
		if (count++ < n)
			console.log(...args)
	}
}

export const log100 = make_limited_logger(100)

