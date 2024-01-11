
import {Core} from "../../core/core.js"
import {Vec2} from "../../tools/math/vec2.js"
import {Vec3} from "../../tools/math/vec3.js"
import {Quat} from "../../tools/math/quat.js"
import {Speeds} from "../../impulse/trajectory/types/speeds.js"
import {ChoreoIntent, Choreography} from "../../dance-studio/models/loader/choreographer/types.js"

export type HumanoidSchema = Core.AsComponentSchema<{
	debug: boolean

	environment: {
		name: string
	}

	position: Vec3
	rotation: Quat
	scale: Vec3

	mesh: number

	light: "hemi"
	density: number
	height: number
	radius: number
	direction: Vec3
	intensity: number

	physical: "dynamic" | "fixed"
	shape: "box"
	offset: {
		position: Vec3
		rotation: Quat
		scale: Vec3
	}

	intent: ChoreoIntent
	gimbal: Vec2
	choreography: ChoreographyComponent

	speeds: Speeds
	sensitivity: {
		keys: number
		mouse: number
		stick: number
	}

	// spectator: {}
	// physicsBox: {}
}>

export type ChoreographyComponent = Omit<Choreography, "gimbal" | "intent">

