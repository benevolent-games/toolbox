
import {Settings} from "../types/settings.js"

export function defaultSettings(): Settings {
	return {
		framerate: true,
		profiling: true,
		viewMode: "embed",
	}
}
