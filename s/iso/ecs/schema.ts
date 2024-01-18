
import {Ecs} from "../../ecs/ecs.js"
import {Vec3} from "../../tools/math/vec3.js"

export type IsoSchema = Ecs.AsSchema<{
	position: Vec3
	tile: "cube"
}>

