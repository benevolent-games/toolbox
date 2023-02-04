
import {html} from "lit"
import {view} from "@chasemoskal/magical"

import {ViewMode, ViewModeData, viewModes} from "../utils/view-selector/view-modes.js"

export const ViewModeButton = view({}, use => ({
		viewMode,
		setViewMode,
	}: {
		viewMode: ViewMode
		setViewMode: (mode: ViewMode) => void
	}) => {

	const {icon} = viewModes[viewMode]
	const [isPanelOpen, setPanelOpen] = use.state(false)

	function togglePanel() {
		setPanelOpen(!isPanelOpen)
	}

	function handleModeClick(e: MouseEvent) {
		const target = e.target as HTMLElement
		const viewModeItem = target.closest<HTMLElement>(".view-mode-item")!
		const mode = viewModeItem.getAttribute("data-view-mode") as ViewMode
		setViewMode(mode)
		setPanelOpen(false)
	}

	function renderViewModeItem([mode, {icon}]: [string, ViewModeData]) {
		return html`
			<span
				class="view-mode-item"
				@click="${handleModeClick}"
				data-view-mode="${mode}"
				?data-selected="${mode === viewMode}">

				${icon}
				<div class=separator>-</div>
				${mode}
			</span>
		`
	}

	return html`
		<div class=view-mode>

			<div
				class=toggle
				@click=${togglePanel}
				?data-opened=${isPanelOpen}>
				${icon}
			</div>

			<div
				class=mode-panel
				?data-opened=${isPanelOpen}>
				${Object
					.entries(viewModes)
					.map(renderViewModeItem)}
			</div>

		</div>
	`
})
