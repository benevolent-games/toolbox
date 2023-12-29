
import {Core} from "../../core/core.js"
import {Vec2} from "../../tools/math/vec2.js"
import {Vec3} from "../../tools/math/vec3.js"
import {Quat} from "../../tools/math/quat.js"
import {RealmContainers} from "../models/realm/realm.js"
import {Speeds} from "../../impulse/trajectory/types/speeds.js"

export type HumanoidSchema = Core.AsComponentSchema<{
	environment: {
		name: keyof RealmContainers
	}

	physics: {
		gravity: number
	}

	prop: {
		type: "box"
		size: number
	}

	hemi: {
		direction: Vec3
		intensity: number
	}

	humanoid: {
		height: number
		mass: number
		radius: number
		choreography: Choreography
	}

	position: Vec3
	rotation: Quat
	scale: Vec3

	sensitivity: {
		keys: number
		mouse: number
		stick: number
	}

	gimbal: Vec2
	speeds: Speeds
	intent: Intent

	spectator: {}
}>

export type Intent = {
	amble: Vec2
	glance: Vec2
}

export type LegAdjustment = {
	initial_swivel: number
	direction: "left" | "right"
	duration: number
	progress: number
}

export type Choreography = {
	ambulation: Vec2
	swivel: number
	adjustment?: LegAdjustment
}

