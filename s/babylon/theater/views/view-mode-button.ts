
import {view} from "@chasemoskal/magical"
import {html} from "lit"
import { ViewMode } from "../element"

export const ViewModeButton = view({}, use => (
	viewMode: ViewMode,
	setViewMode: (mode: ViewMode) => void) => {
	
	const [viewModePanel, setViewModePanel] = use.state(false)
	return html`
		<div class="view-mode">
			<div @click=${() => {setViewModePanel(!viewModePanel)}}>View mode(${viewMode})</div>
				<div @click=${(e: PointerEvent) => {
					const target = <HTMLElement>e.target
					const content = <ViewMode>target.textContent
					setViewMode(content)
				}} 
					data-opened=${viewModePanel} class="mode-panel">
					<span>fullscreen</span>
					<span>embed</span>
					<span>cinema</span>
				</div>
		</div>
	`
})
