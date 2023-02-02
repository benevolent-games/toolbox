
import {view} from "@chasemoskal/magical"
import {html} from "lit"
import {BenevTheater, ViewMode} from "../element"

export const ViewModeButton = view({}, use => (
	viewMode: ViewMode,
	setViewMode: (mode: ViewMode) => void,
	theater: BenevTheater) => {

	const [viewModePanel, setViewModePanel] = use.state(false)
	if (viewMode == "fullscreen") theater.requestFullscreen()
		else document.exitFullscreen()

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
