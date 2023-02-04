
import {html} from "lit"
import {view} from "@chasemoskal/magical"

import {setupInterval} from "../utils/setup-interval.js"
import {Instrumentation} from "../utils/profiling/instrumentation.js"
import {gatherProfilingInfo} from "../utils/profiling/gather-profiling-info.js"
import {defaultProfilingInfo} from "../utils/profiling/default-profiling-info.js"

import bugReport from "../../../icons/material-design-icons/bug-report.js"

export const Profiling = view({}, use => (instrumentation: Instrumentation) => {
	const [isPanelOpen, setPanelOpen] = use.state(false)
	const [profilingInfo, setProfilingInfo] = use.state(defaultProfilingInfo)

	use.setup(setupInterval(
		100,
		() => setProfilingInfo(gatherProfilingInfo(instrumentation)),
	))

	function togglePanel() {
		setPanelOpen(!isPanelOpen)
	}

	function renderTime([profileKey, time]: [string, number]) {
		return html`
			<p>${profileKey}: ${time.toFixed(2)} ms</p>
		`
	}

	return html`
		<div
			class="profile-info"
			?data-opened=${isPanelOpen}>

			<button @click=${togglePanel}>
				${bugReport}
			</button>

			<div 
				class="profile-panel"
				?data-opened=${isPanelOpen}>
				${Object
					.entries(profilingInfo)
					.map(renderTime)}
			</div>
		</div>
	`
})
