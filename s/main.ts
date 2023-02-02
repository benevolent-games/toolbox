
export {registerElements} from "@chasemoskal/magical"

import { RangeSlider } from "./editor-ui/range-slider/element.js"
import { ViewingModes } from "./editor-ui/viewing-modes/element.js"
import { BenevTheater } from "./babylon/theater/element.js"
export const getElements = () => ({
	RangeSlider,
	ViewingModes,
	BenevTheater
})
