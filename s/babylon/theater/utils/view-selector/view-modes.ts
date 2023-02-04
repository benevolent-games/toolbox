
import {SVGTemplateResult} from "lit"

import rectangleSvg from "../../../../icons/coreui-icons/rectangle.svg.js"
import fullscreenSvg from "../../../../icons/material-design-icons/fullscreen.svg.js"
import fullscreenExitSvg from "../../../../icons/material-design-icons/fullscreen-exit.svg.js"

export interface ViewModeData {
	icon: SVGTemplateResult
}

export const viewModes = {
	small: {icon: fullscreenExitSvg},
	cinema: {icon: rectangleSvg},
	fullscreen: {icon: fullscreenSvg},
} satisfies {[key: string]: ViewModeData}

export type ViewModes = typeof viewModes

export type ViewMode = keyof ViewModes
