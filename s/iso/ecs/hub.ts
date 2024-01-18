
import {Ecs} from "../../ecs/ecs.js"
import {IsoSchema} from "./schema.js"

export const hub = new Ecs.Hub<IsoBase, IsoTick, IsoSchema>()

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

