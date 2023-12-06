
import {Settings} from "../types/settings.js"
import {ViewMode} from "./view-selector/view-modes.js"

export function viewModeSetter({
		settings,
		enterFullscreen,
	}: {
		settings: Settings
		enterFullscreen: () => void
	}) {

	return (mode: ViewMode) => {
		settings.viewMode = mode

		const isCurrentlyFullscreen = !!document.fullscreenElement

		if (mode === "fullscreen") {
			if (!isCurrentlyFullscreen)
				enterFullscreen()
		}
		else {
			if (isCurrentlyFullscreen)
				document.exitFullscreen()
		}
	}
}
