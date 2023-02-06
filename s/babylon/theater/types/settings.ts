
import {TemplateResult} from "lit"
import {ViewMode} from "../utils/view-selector/view-modes.js"
interface Renderer {
	(): TemplateResult
}
export interface Settings {
	viewMode: ViewMode
	framerate: boolean
	profiling: boolean
	addRenderer: (renderer: Renderer) => () => void
}
