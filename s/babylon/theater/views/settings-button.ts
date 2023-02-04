
import {html} from "lit"
import {view} from "@chasemoskal/magical"
import settingsSvg from "../../../icons/material-design-icons/settings.svg.js"

import settingSvg from "../../../icons/iconscout/setting-svg.js"

export const SettingsButton = view({}, use => ({
		showFramerate,
		showProfiling,
		setShowFramerate,
		setShowProfiling,
	}: {
		showFramerate: boolean
		showProfiling: boolean
		setShowFramerate: (showFramerate: boolean) => void
		setShowProfiling: (showProfiling: boolean) => void
	}) => {
	const [isPanelOpen, setPanelOpen] = use.state(false)

	function togglePanel() {
		setPanelOpen(!isPanelOpen)
	}

	function handleShowFramerateChange(event: Event) {
		const input = <HTMLInputElement>event.target
		setShowFramerate(input.checked)
	}

	function handleShowProfilingChange(event: Event) {
		const input = <HTMLInputElement>event.target
		setShowProfiling(input.checked)
	}

	return html`
		<div
			class="settings"
			?data-opened=${isPanelOpen}>

			<button @click=${togglePanel}>
				${settingSvg}
			</button>

			<div
				class="settings-panel"
				?data-opened=${isPanelOpen}>

				<label>
					show framerate
					<input
						type=checkbox
						?checked=${showFramerate}
						@input=${handleShowFramerateChange} />
				</label>
				<label>
					show profile-info
					<input
						type=checkbox
						?checked=${showProfiling}
						@input=${handleShowProfilingChange} />
				</label>
			</div>
		</div>
	`
})
