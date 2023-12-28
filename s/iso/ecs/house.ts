
import {IsoSchema} from "./schema.js"
import {Core} from "../../core/core.js"

export type Base = {
	entities: Core.Entities<IsoSchema>
}

export type Tick = {
	tick: number
}

export const house = new class House {
	entities = new Core.Entities<IsoSchema>()
	system = Core.configure_systems<Base, Tick>()
	canvas = document.createElement("canvas")
	context = this.canvas.getContext("2d", {
		alpha: false,
		desynchronized: true,
		willReadFrequently: false,
	} as CanvasRenderingContext2DSettings)!
}

