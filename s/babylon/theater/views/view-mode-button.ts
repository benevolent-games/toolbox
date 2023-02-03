
import {html} from "lit"
import {view} from "@chasemoskal/magical"

import {ViewMode} from "../types/view-mode.js"

import fullscreenSvg from "../../../icons/material-design-icons/fullscreen.svg.js"
import fullscreenExitSvg from "../../../icons/material-design-icons/fullscreen-exit.svg.js"
import rectangleSvg from "../../../icons/coreui-icons/rectangle.svg.js"

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

	function renderSelectedModeSvg() {
		return viewMode === "fullscreen"
			? html`${fullscreenSvg}`
			: viewMode === "embed"
			? html`${fullscreenExitSvg}`
			: html`${rectangleSvg}`
	}

	return html`
		<div class=view-mode>
		
			<div class=toggle
			 @click=${togglePanel}
			 ?data-opened=${isPanelOpen}>
				${renderSelectedModeSvg()}
			</div>

			<div
				class=mode-panel
				@click=${handleModeClick}
				?data-opened=${isPanelOpen}>
				<span ?data-selected=${viewMode === "fullscreen"} data-view-mode=fullscreen>
					${fullscreenSvg}<div class=separator>-</div>fullscreen
				</span>
				<span ?data-selected=${viewMode === "embed"} data-view-mode=embed>
					${fullscreenExitSvg}<div class=separator>-</div>embed
				</span>
				<span ?data-selected=${viewMode === "cinema"} data-view-mode=cinema>
					${rectangleSvg}<div class=separator>-</div>cinema
				</span>
			</div>

		</div>
	`
})
