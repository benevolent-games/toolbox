
export function repeat(n: number, fun: (i: number) => void) {
	for (let i = 0; i < n; i++)
		fun(i)
}
