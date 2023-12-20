
import {Core} from "./core.js"
import {Quat} from "../tools/math/quat.js"
import {Vec3} from "../tools/math/vec3.js"

export type BabylonSchema = Core.AsComponentSchema<{
	transform: {
		position: Vec3
		rotation: Quat
		scale: Vec3
	}

	parent: {
		entity: Core.Id
		attachment: "transform"
	}

	model: {
		container: string
	}

	targetCamera: {
		fov: number
		minZ: number
		maxZ: number
	}

	hemispheric_light: {
		direction: Vec3
		intensity: number
	}
}>

