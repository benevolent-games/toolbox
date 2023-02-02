
import {Settings} from "../types/settings.js"
import {ViewMode} from "../types/view-mode.js"

export function viewModeSetter({
		settings,
		enterFullscreen,
		onViewModeChange,
	}: {
		settings: Settings
		enterFullscreen: () => void
		onViewModeChange: () => void
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

		onViewModeChange()
	}
}
