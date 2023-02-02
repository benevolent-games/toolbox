
import {html} from "lit"
import {view} from "@chasemoskal/magical"

import {setupInterval} from "../utils/setup-interval.js"
import {formatFramerate} from "../utils/format-framerate.js"

export const FramerateDisplay = view({}, use => ({
		getFramerate
	}: {
		getFramerate: () => number
	}) => {

	const [framerate, setFramerate] = use.state("---")

	use.setup(
		setupInterval(
			100,
			() => setFramerate(formatFramerate(getFramerate())),
		)
	)

	return html`
		<div>${framerate}</div>
	`
})
