
import {html} from "lit"
import {view} from "@chasemoskal/magical"

import {ViewMode} from "../types/view-mode.js"

export const ViewModeButton = view({}, use => ({
		viewMode,
		setViewMode,
	}: {
		viewMode: ViewMode
		setViewMode: (mode: ViewMode) => void
	}) => {

	const [isPanelOpen, setPanelOpen] = use.state(false)

	function togglePanel() {
		setPanelOpen(!isPanelOpen)
	}

	function handleModeClick(e: PointerEvent) {
		const target = <HTMLElement>e.target
		const mode = target.getAttribute("data-view-mode") as ViewMode
		setViewMode(mode)
		setPanelOpen(false)
	}

	return html`
		<div class=view-mode>

			<div @click=${togglePanel}>
				View mode(${viewMode})
			</div>

			<div
				class=mode-panel
				@click=${handleModeClick}
				?data-opened=${isPanelOpen}>
				<span data-view-mode=fullscreen>fullscreen</span>
				<span data-view-mode=embed>embed</span>
				<span data-view-mode=cinema>cinema</span>
			</div>

		</div>
	`
})
