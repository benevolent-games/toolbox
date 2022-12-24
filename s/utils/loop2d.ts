
export function loop2d(
		rx: number,
		ry: number,
		fun: (x: number, y: number) => void,
	) {
	for (let x = 0; x < rx; x++)
		for (let y = 0; y < ry; y++)
			fun(x, y)
}
