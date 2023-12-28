
import {Core} from "../../core/core.js"
import {Vec3} from "../../tools/math/vec3.js"

export type IsoSchema = Core.AsComponentSchema<{
	position: Vec3
	tile: "cube"
}>

