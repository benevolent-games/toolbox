
import {HumanoidContainers, Realm} from "../models/realm/realm.js"
import {Vec3, vec3} from "../../tools/math/vec3.js"
import {Quat, quat} from "../../tools/math/quat.js"
import {Choreographer} from "../../dance-studio/models/loader/choreographer/choreographer.js"
import {Sensitivity} from "../models/impulse/types.js"

export const spawners = (realm: Realm) => ({

	spectator: ({position, sensitivity}: {
			position: Vec3,
			sensitivity: Sensitivity
		}) => realm.entities.create({
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
		}) => realm.entities.create({
		physical: "dynamic",
		shape: "box",
		density,
		position,
		rotation,
		scale,
	}),

	environment: (e: keyof HumanoidContainers) => realm.entities.create({
		environment: e,
	}),

	// humanoid: ({position, debug}: {
	// 		position: Vec3
	// 		debug: boolean
	// 	}) => {
	// 	const {intent, gimbal, ...choreography} = (
	// 		Choreographer.default_choreography()
	// 	)
	// 	return realm.entities.create({
	// 		debug,
	// 		humanoid: {
	// 			height: 1.75,
	// 			mass: 70,
	// 			radius: 0.3,
	// 		},
	// 		choreography,
	// 		intent,
	// 		gimbal,
	// 		position,
	// 		rotation: quat.identity(),
	// 		velocity: vec3.zero(),
	// 		sensitivity: {
	// 			keys: 2,
	// 			stick: 1,
	// 			mouse: 3 / 100,
	// 		},
	// 		speeds: {
	// 			base: 0.5,
	// 			fast: 1.5,
	// 			slow: 0.1,
	// 		},
	// 	})
	// },
})

