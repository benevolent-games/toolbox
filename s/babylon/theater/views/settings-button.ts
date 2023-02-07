
import {html} from "lit"

import settingSvg from "../../../icons/iconscout/setting-svg.js"
import {Renderer} from "../utils/default-settings.js"
import {buttonPanelView} from "./button-panel-view.js"

export const SettingsButton = buttonPanelView(use => ({
		showFramerate,
		showProfiling,
		setShowFramerate,
		setShowProfiling,
		additionalSettings
	}: {
		showFramerate: boolean
		showProfiling: boolean
		setShowFramerate: (showFramerate: boolean) => void
		setShowProfiling: (showProfiling: boolean) => void
		additionalSettings: Renderer[]
	}) => {

	return {
		name: "settings",
		button: () => settingSvg,
		panel: () => html`
			<div class="settings-panel z-2">
				<benev-checkbox
					@change=${({detail}: CustomEvent<boolean>) => {setShowFramerate(detail)}}
					?checked=${showFramerate}>
					show framerate
				</benev-checkbox>
				<benev-checkbox
					@change=${({detail}: CustomEvent<boolean>) => {setShowProfiling(detail)}}
					?checked=${showProfiling}>
					show profile info
				</benev-checkbox>
				${additionalSettings.map(renderer => renderer())}
			</div>`
	}
})
