
import {html} from "lit"

import settingSvg from "../../../icons/iconscout/setting-svg.js"
import { buttonPanelView } from "./button-panel-view.js"

export const SettingsButton = buttonPanelView(use => ({
		showFramerate,
		showProfiling,
		setShowFramerate,
		setShowProfiling
	}: {
		showFramerate: boolean
		showProfiling: boolean
		setShowFramerate: (showFramerate: boolean) => void
		setShowProfiling: (showProfiling: boolean) => void
	}) => {

	function handleShowFramerateChange(event: Event) {
		const input = <HTMLInputElement>event.target
		setShowFramerate(input.checked)
	}

	function handleShowProfilingChange(event: Event) {
		const input = <HTMLInputElement>event.target
		setShowProfiling(input.checked)
	}
	return {
		name: "settings",
		button: () => settingSvg,
		panel: () => html`
			<div class="settings-panel">
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
			</div>`
	}
})