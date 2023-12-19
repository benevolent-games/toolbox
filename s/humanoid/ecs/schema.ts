
import {Core} from "../../core/core.js"
import {Containers} from "./systematize.js"
import {Quat} from "../../tools/math/quat.js"
import {Vec2} from "../../tools/math/vec2.js"
import {Vec3} from "../../tools/math/vec3.js"

export type HumanoidSchema = Core.AsComponentSchema<{
	model: {
		container: keyof Containers
	}
	transform: {
		position: Vec3
		rotation: Quat
		scale: Vec3
	}
	gimbal: Vec2
	flyControls: {
		speed: 1,
	}
	camera: {
		attachment: "transform" | "gimbal"
		fov: number
		minZ: number
		maxZ: number
	}
	light: {
		type: "hemi"
		direction: Vec3
		intensity: number
	}
}>

