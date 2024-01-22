
import {Ecs3} from "../../ecs/ecs3.js"
import {IsoSchema} from "./schema.js"

export const hub = new Ecs3.Hub<IsoBase, IsoTick, IsoSchema>()

export class IsoBase {
	entities = hub.entities()
	canvas = document.createElement("canvas")
	context = this.canvas.getContext("2d", {
		alpha: false,
		desynchronized: true,
		willReadFrequently: false,
	} as CanvasRenderingContext2DSettings)!
}

export type IsoTick = {
	tick: number
}

