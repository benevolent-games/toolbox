
export function formatFramerate(framerate: number) {
	return framerate
		.toFixed(0)
		.padStart(3, "X")
		.replaceAll("X", "&nbsp;")
}
