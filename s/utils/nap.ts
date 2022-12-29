
export async function nap(milliseconds: number = 0) {
	return new Promise<void>(
		resolve => setTimeout(resolve, milliseconds)
	)
}
