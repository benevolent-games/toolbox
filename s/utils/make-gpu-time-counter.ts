
export function makeGpuTimeCounter({getCpuTime}: {
	getCpuTime: () => string
	}) {

	const element = document.createElement("div")
	element.className = "gpu-time"
	element.textContent = "___"

	setInterval(
		() => element.innerHTML = "gpu frame time: " + getCpuTime() + "ms",
		100
	)
	return element
}
