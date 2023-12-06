
import {Settings} from "../types/settings.js"

export function setupFullscreenListener(settings: Settings) {

	return () => {
		const listener = () => {
			const isCurrentlyFullscreen = !!document.fullscreenElement

			if (!isCurrentlyFullscreen && settings.viewMode == "fullscreen") {
				settings.viewMode = "small"
			}

			settings.viewMode = isCurrentlyFullscreen
				? "fullscreen"
				: settings.viewMode
		}

		window.addEventListener("fullscreenchange", listener)

		return () => window.removeEventListener(
			"fullscreenchange",
			listener,
		)
	}
}
