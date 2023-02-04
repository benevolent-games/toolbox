
import {html} from "lit"
import {view} from "@chasemoskal/magical"
import settingsSvg from "../../../icons/material-design-icons/settings.svg.js"

export const SettingsButton = view({}, use => ({}: {}) => {

	return html`
		<button>${settingsSvg}</button>
	`
})
