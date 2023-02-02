
import {BenevTheater} from "../element.js"

export function setupFullscreenListener(theater: BenevTheater) {

	return () => {
		const listener = () => {
			const isCurrentlyFullscreen = !!document.fullscreenElement
			theater["view-mode"] = isCurrentlyFullscreen
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
