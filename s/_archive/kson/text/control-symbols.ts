
import {obtool} from "@chasemoskal/magical"
import {controls} from "./controls.js"

export const controlSymbols = (
	obtool(controls)
		.map(() => Symbol())
)
