
import {Core} from "../../core/core.js"
import {HumanoidSchema} from "./schema.js"
import {vec2} from "../../tools/math/vec2.js"
import {Vec3, vec3} from "../../tools/math/vec3.js"
import {Quat, quat} from "../../tools/math/quat.js"
import {Sensitivity} from "../models/impulse/types.js"
import {HumanoidContainers} from "../models/realm/realm.js"

export const spawners = (entities: Core.Entities<HumanoidSchema>) => ({

	hemi: ({direction, intensity}: {direction: Vec3, intensity: number}) => entities.create({
		light: "hemi",
		direction,
		intensity,
	}),

	spectator: ({position, sensitivity}: {
			position: Vec3,
			sensitivity: Sensitivity
		}) => entities.create({
		spectator: {},
		camera: {
			fov: 90,
			minZ: 0.1,
			maxZ: 1_000,
		},
		intent: {
			amble: vec3.zero(),
			glance: vec2.zero(),
			fast: false,
			slow: false,
		},
		smoothing: 5,
		force: vec3.zero(),
		gimbal: [0, 0.5],
		position,
		sensitivity,
		speeds: {
			base: 20,
			fast: 50,
			slow: 5,
		},
	}),

	physicsBox: ({
			density,
			position,
			rotation,
			scale,
		}: {
			scale: Vec3
			position: Vec3
			rotation: Quat
			density: number
		}) => entities.create({
		physical: "dynamic",
		shape: "box",
		density,
		position,
		rotation,
		scale,
	}),

	environment: (e: keyof HumanoidContainers) => entities.create({
		environment: e,
	}),

	humanoid: ({debug, position, sensitivity}: {
			debug: boolean
			position: Vec3
			sensitivity: Sensitivity
		}) => entities.create({
		humanoid: {},
		third_person_cam_distance: 1.5,
		camera: {
			fov: 90,
			minZ: 0.1,
			maxZ: 1_000,
		},
		debug,
		height: 1.75,
		mass: 70,
		radius: .3,
		intent: {
			amble: vec3.zero(),
			glance: vec2.zero(),
			fast: false,
			slow: false,
		},
		smoothing: 4,
		force: vec3.zero(),
		gimbal: [0, 0.5],
		choreography: {
			swivel: .5,
			adjustment: null,
			settings: {
				swivel_readjustment_margin: .1,
				swivel_duration: 20,
			},
		},
		position,
		rotation: quat.identity(),
		velocity: vec3.zero(),
		sensitivity,
		speeds: {
			base: 3,
			fast: 6,
			slow: 1.5,
		},
	}),
})

