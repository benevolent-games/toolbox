
import {Core} from "../../core/core.js"
import {Vec2} from "../../tools/math/vec2.js"
import {Vec3} from "../../tools/math/vec3.js"
import {Quat} from "../../tools/math/quat.js"
import {RealmContainers} from "../models/realm/realm.js"
import {Speeds} from "../../impulse/trajectory/types/speeds.js"

export type Spatial = {
	position: Vec3
	rotation: Quat
	scale: Vec3
}

export type HumanoidSchema = Core.AsComponentSchema<{
	environment: {
		name: keyof RealmContainers
	}

	physics: {
		gravity: number
	}

	prop: {
		spatial: Spatial
		type: "box"
		size: number
	}

	hemi: {
		direction: Vec3
		intensity: number
	}

	humanoid: {
		position: Vec3
		speeds: Speeds
		height: number
		mass: number
		radius: number
		gimbal: Vec2
		sensitivity: {
			keys: number
			mouse: number
			stick: number
		}
	}

	spectator: {
		position: Vec3
		gimbal: Vec2
		speeds: Speeds
		sensitivity: {
			keys: number
			mouse: number
			stick: number
		}
	}
}>

