
import {Core} from "../../core/core.js"
import {Vec2} from "../../tools/math/vec2.js"
import {Vec3} from "../../tools/math/vec3.js"
import {Quat} from "../../tools/math/quat.js"
import {RealmContainers} from "../models/realm/realm.js"
import {Speeds} from "../../impulse/trajectory/types/speeds.js"
import {ChoreoIntent, Choreography} from "../../dance-studio/models/loader/choreo/types.js"

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
		choreography: Omit<Choreography, "gimbal" | "intent">
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
	intent: ChoreoIntent
	speeds: Speeds

	spectator: {}
}>

