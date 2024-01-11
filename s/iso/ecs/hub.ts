
import {IsoSchema} from "./schema.js"
import {Core} from "../../core/core.js"

export class Hub {
	entities = new Core.Entities<IsoSchema>()
	canvas = document.createElement("canvas")
	context = this.canvas.getContext("2d", {
		alpha: false,
		desynchronized: true,
		willReadFrequently: false,
	} as CanvasRenderingContext2DSettings)!
}

export const {system, rezzer} = Core.configure_systems<IsoSchema, Hub, Core.StdTick>()

