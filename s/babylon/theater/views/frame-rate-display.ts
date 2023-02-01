
import {html} from "lit"
import {view} from "@chasemoskal/magical"

export const makeFramerateDisplay = view({}, use => ({
		getFramerate
	}: {
		getFramerate: () => number
	}) => {

	const [framerate, setFramerate] = use.state("---")

	setInterval(
		() => setFramerate(getFramerate()
			.toFixed(0)
			.padStart(3, "X")
			.replaceAll("X", "&nbsp;")),
		100
	)

	return html`
		<div>${framerate}</div>
	`
})
