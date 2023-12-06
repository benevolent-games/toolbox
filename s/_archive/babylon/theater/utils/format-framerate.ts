
export function formatFramerate(framerate: number) {
	return framerate
		.toFixed(0)
		.padStart(3, "")
}
