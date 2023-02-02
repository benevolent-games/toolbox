
export function setupInterval(
		milliseconds: number,
		action: () => void,
	) {

	return () => {
		const interval = setInterval(action, milliseconds)
		return () => clearInterval(interval)
	}
}
