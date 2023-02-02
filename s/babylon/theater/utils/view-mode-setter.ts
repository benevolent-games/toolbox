
import {BenevTheater} from "../element.js"
import {ViewMode} from "../types/view-mode.js"

export function viewModeSetter({theater, onViewModeChange}: {
		theater: BenevTheater,
		onViewModeChange: () => void,
	}) {

	return (mode: ViewMode) => {
		theater["view-mode"] = mode

		const isCurrentlyFullscreen = !!document.fullscreenElement

		if (mode === "fullscreen") {
			if (!isCurrentlyFullscreen)
				theater.requestFullscreen()
		}
		else {
			if (isCurrentlyFullscreen)
				document.exitFullscreen()
		}

		onViewModeChange()
	}
}
