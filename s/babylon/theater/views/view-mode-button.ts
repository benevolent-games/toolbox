
import {view} from "@chasemoskal/magical"
import {html} from "lit"
import { ViewMode } from "../element"

export const ViewModeButton = view({}, use => (
	viewMode: ViewMode,
	setViewMode: (mode: ViewMode) => void) => {

	return html`
		<div class="view-mode" @click=${() => setViewMode("cinema")}>
			View mode
			<div>${viewMode}</div>
		</div>
	`
})
