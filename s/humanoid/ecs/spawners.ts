
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
		intent: {
			amble: vec3.zero(),
			glance: vec2.zero(),
		},
		smoothing: 10,
		force: vec3.zero(),
		gimbal: [0, 0.5],
		position,
		sensitivity,
		speeds: {
			base: 1,
			fast: 2,
			slow: 0.2,
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
		}) => {
		return entities.create({
			humanoid: {},
			debug,
			height: 1.75,
			mass: 70,
			radius: 0.3,
			intent: {
				amble: vec3.zero(),
				glance: vec2.zero(),
			},
			smoothing: 10,
			force: vec3.zero(),
			gimbal: [0, 0.5],
			choreography: {
				swivel: 0.5,
				adjustment: null,
				settings: {
					swivel_readjustment_margin: 0.1,
					swivel_duration: 20,
				},
			},
			position,
			rotation: quat.identity(),
			velocity: vec3.zero(),
			sensitivity,
			speeds: {
				base: 0.5,
				fast: 1.5,
				slow: 0.1,
			},
		})
	},
})

