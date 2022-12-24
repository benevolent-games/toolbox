
export async function nap(milliseconds: number) {
	return new Promise<void>(
		resolve => setTimeout(resolve, milliseconds)
	)
}
