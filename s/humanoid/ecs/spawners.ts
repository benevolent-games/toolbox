
import {Core} from "../../core/core.js"
import {HumanoidSchema} from "./schema.js"
import {Vec3, vec3} from "../../tools/math/vec3.js"
import {Quat, quat} from "../../tools/math/quat.js"
import {Sensitivity} from "../models/impulse/types.js"
import {HumanoidContainers} from "../models/realm/realm.js"
import {Choreographer} from "../../dance-studio/models/loader/choreographer/choreographer.js"

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
			amble: [0, 0],
			glance: [0, 0],
		},
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
		const {intent, gimbal, ...choreography} = (
			Choreographer.default_choreography()
		)
		return entities.create({
			humanoid: {},
			debug,
			height: 1.75,
			mass: 70,
			radius: 0.3,
			choreography,
			intent,
			gimbal,
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

