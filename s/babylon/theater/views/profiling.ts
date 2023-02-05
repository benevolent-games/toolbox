
import {html} from "lit"

import {setupInterval} from "../utils/setup-interval.js"
import {Instrumentation} from "../utils/profiling/instrumentation.js"
import {gatherProfilingInfo} from "../utils/profiling/gather-profiling-info.js"
import {defaultProfilingInfo} from "../utils/profiling/default-profiling-info.js"

import bugReport from "../../../icons/material-design-icons/bug-report.js"
import {buttonPanelView} from "./button-panel-view.js"

export const Profiling = buttonPanelView(use => (instrumentation: Instrumentation) => {
	const [profilingInfo, setProfilingInfo] = use.state(defaultProfilingInfo)

	use.setup(setupInterval(
	100,
		() => setProfilingInfo(gatherProfilingInfo(instrumentation))))

	function renderTime([profileKey, time]: [string, number]) {
		return html`<p>${profileKey}: ${time.toFixed(2)} ms</p>`
	}

	return {
		name: "profile-info",
		button: () => bugReport,
		panel: () => html`
			<div class="profile-panel">
				${Object
					.entries(profilingInfo)
					.map(renderTime)}
			</div>
			`
	}
})