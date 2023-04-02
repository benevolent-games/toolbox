
export function selectors_are_the_same(a: string[], b: string[]) {
	return (
		a.length === b.length
			&&
		a.every(s => b.includes(s))
	)
}
