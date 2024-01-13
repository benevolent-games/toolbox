
import {Core} from "../../core/core.js"
import {Vec2} from "../../tools/math/vec2.js"
import {Vec3} from "../../tools/math/vec3.js"
import {Quat} from "../../tools/math/quat.js"
import {HumanoidContainers} from "../models/realm/realm.js"
import {Speeds} from "../../impulse/trajectory/types/speeds.js"
import {Choreography} from "./systems/choreography/calculations.js"

export type HumanoidSchema = Core.AsComponentSchema<{
	debug: boolean
	environment: keyof HumanoidContainers

	position: Vec3
	rotation: Quat
	scale: Vec3
	velocity: Vec3

	mesh: number

	light: "hemi"
	density: number
	mass: number
	height: number
	radius: number
	direction: Vec3
	intensity: number

	physical: "dynamic" | "fixed"
	shape: "box"

	intent: {
		amble: Vec3
		glance: Vec2
	}
	smoothing: number
	force: Vec3
	gimbal: Vec2

	choreography: Choreography

	speeds: Speeds
	sensitivity: {
		keys: number
		mouse: number
		stick: number
	}

	spectator: {}
	humanoid: {}
}>

export type ChoreographyComponent = Omit<Choreography, "gimbal" | "intent">

