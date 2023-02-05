
import {html} from "lit"

import settingSvg from "../../../icons/iconscout/setting-svg.js"
import {buttonPanelView} from "./button-panel-view.js"

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

	return {
		name: "settings",
		button: () => settingSvg,
		panel: () => html`
			<div class="settings-panel">
				<benev-checkbox
					@change=${(checked: boolean) => setShowFramerate(checked)}
					?checked=${showFramerate}>
					show framerate
				</benev-checkbox>
				<benev-checkbox
					@change=${(checked: boolean) => setShowProfiling(checked)}
					?checked=${showProfiling}>
					show profile info
				</benev-checkbox>
			</div>`
	}
})