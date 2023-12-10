
export function repeater(hz: number, fn: () => void) {
	const delay = 1000 / hz
	let active = true
	const repeat = () => {
		if (!active)
			return
		fn()
		setTimeout(repeat, delay)
	}
	repeat()
	return () => { active = false }
}

export function interval(hz: number, fn: () => void) {
	const delay = 1000 / hz
	const id = setInterval(fn, delay)
	return () => clearInterval(id)
}

