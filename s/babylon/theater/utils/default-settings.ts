
import {TemplateResult} from "lit"
import {Settings} from "../types/settings.js"
export interface Renderer {
	(): TemplateResult
}

export function defaultSettings(renderers: Renderer[]): Settings {
	return {
		framerate: true,
		profiling: true,
		viewMode: "small",
		addRenderer: (renderer: Renderer) => {
			renderers.push(renderer)
			return () => {
				const index = renderers.indexOf(renderer)
				if (index >= 0) {
					renderers.splice(index, 1)
				}
			}
		}
	}
}
