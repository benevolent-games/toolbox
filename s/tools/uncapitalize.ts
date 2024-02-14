
export function uncapitalize(s: string) {
	if (s.length) {
		const [c] = s
		const rest = s.slice(1)
		return c.toLowerCase() + rest
	}
	return s
}

