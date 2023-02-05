
import {html} from "lit"

import {ViewMode, ViewModeData, viewModes} from "../utils/view-selector/view-modes.js"
import {setupListener} from "../utils/setup-listener.js"
import {buttonPanelView} from "./button-panel-view.js"

export const ViewModeButton = buttonPanelView(use => (
	{viewMode, setViewMode}:
	{viewMode: ViewMode, setViewMode: (mode: ViewMode) => void}) => {

	const {icon} = viewModes[viewMode]

	function handleModeClick(e: MouseEvent) {
		const target = e.target as HTMLElement
		const viewModeItem = target.closest<HTMLElement>(".view-mode-item")!
		const mode = viewModeItem.getAttribute("data-view-mode") as ViewMode
		setViewMode(mode)
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

	return {
		button: () => icon,
		panel: () => html`
			<div class=mode-panel>
				${Object
					.entries(viewModes)
					.map(renderViewModeItem)}
			</div>
		`
	}
})

// 	use.setup(setupListener(window, "pointerdown", (e) => {
// 		const modePanel = e.composedPath().find((element: HTMLElement) =>
// 			element.className == "mode-panel")
// 		if(!modePanel) {setPanelOpen(false)}
// 	}))


