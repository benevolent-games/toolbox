
import {html} from "lit"
import {view} from "@chasemoskal/magical"
import alignLeftSvg from "../../../icons/remix-icons/align-left.svg.js"

export const NubsButton = view({}, use => ({}: {}) => {
const [isPanelOpen, setPanelOpen] = use.state(false)

	function togglePanel() {
		setPanelOpen(!isPanelOpen)
	}
	return html`
		<div class=editor>
			<nub-context>
				<div class=nubs-button @click=${togglePanel}>
					${alignLeftSvg}
				</div>
				<nub-editor ?data-opened=${isPanelOpen}></nub-editor>
			</nub-context>
		</div>
	`
})
