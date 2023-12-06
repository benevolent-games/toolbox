
import {html} from "lit"
import alignLeftSvg from "../../../icons/remix-icons/align-left.svg.js"
import {buttonPanelView} from "./button-panel-view.js"

export const NubsButton = buttonPanelView(use => () => {
	return {
		name: "editor",
		button: () => alignLeftSvg,
		panel: () => html`
			<nub-editor></nub-editor>
		`
	}
})
