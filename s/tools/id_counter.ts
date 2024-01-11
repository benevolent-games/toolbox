
export function id_counter() {
	let count = 0
	return () => {
		return count++
	}
}

