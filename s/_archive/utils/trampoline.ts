
export function trampoline<P extends any[], R>(
		fun: (...params: P) => R
	): (...params: P) => R {

	return (...params) => {
		let result = fun(...params)

		while (typeof result === "function")
			result = result()

		return result
	}
}
