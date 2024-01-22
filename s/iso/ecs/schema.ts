
import {Ecs3} from "../../ecs/ecs3.js"
import {Vec3} from "../../tools/math/vec3.js"

export type IsoSchema = Ecs3.AsSchema<{
	position: Vec3
	tile: "cube"
}>

