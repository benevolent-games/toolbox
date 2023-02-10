
import {html} from "lit"

import settingSvg from "../../../icons/iconscout/setting-svg.js"
import {Renderer} from "../utils/default-settings.js"
import {buttonPanelView} from "./button-panel-view.js"

export const SettingsButton = buttonPanelView(use => ({
		showFramerate,
		showProfiling,
		resolutionScale,
		setShowFramerate,
		setShowProfiling,
		setResolutionScale,
		additionalSettings
	}: {
		showFramerate: boolean
		showProfiling: boolean
		resolutionScale: number,
		setShowFramerate: (showFramerate: boolean) => void
		setShowProfiling: (showProfiling: boolean) => void
		setResolutionScale: (resolution: number) => void
		additionalSettings: Renderer[]
	}) => {

	return {
		name: "settings",
		button: () => settingSvg,
		panel: () => html`
			<div class="settings-panel">
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
				<range-slider 
					label="Resolution scale"
					initial-value=${resolutionScale}
					min="10"
					step="1"
					max="100"
					@valuechange=${({detail: {value}}: CustomEvent<{value: string}>) => setResolutionScale(Number(value))}>
				</range-slider>
				${additionalSettings.map(renderer => renderer())}
			</div>`
	}
})
