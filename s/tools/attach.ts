
export function attach<A extends any[], B extends any[], R>(
		fn: (...args: [...A, ...B]) => R,
		...a: A
	): (...args: B) => R {
	return (...b: B) => fn(...a, ...b);
}

