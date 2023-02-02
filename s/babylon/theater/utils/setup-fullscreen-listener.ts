
import {Settings} from "../types/settings.js"

export function setupFullscreenListener(settings: Settings) {

	return () => {
		const listener = () => {
			const isCurrentlyFullscreen = !!document.fullscreenElement
			settings.viewMode = isCurrentlyFullscreen
				? "fullscreen"
				: "embed"
		}

		window.addEventListener("fullscreenchange", listener)

		return () => window.removeEventListener(
			"fullscreenchange",
			listener,
		)
	}
}
