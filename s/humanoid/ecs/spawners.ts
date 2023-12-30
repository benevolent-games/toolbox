
import {house} from "./house.js"
import {Vec3} from "../../tools/math/vec3.js"
import {Choreographer} from "../../dance-studio/models/loader/choreographer/choreographer.js"

export const spawners = {

	spectator: ({position}: {
			position: Vec3,
		}) => house.entities.create({
		spectator: {},
		position,
		sensitivity: {
			keys: 10 / 100,
			mouse: 10 / 100,
			stick: 10 / 100,
		},
		gimbal: [0, 0.5],
		speeds: {
			base: 1,
			fast: 2,
			slow: 0.2,
		},
		intent: {
			amble: [0, 0],
			glance: [0, 0],
		},
	}),

	humanoid: ({position}: {
			position: Vec3
		}) => {
		const {intent, gimbal, ...choreography} = (
			Choreographer.default_choreography()
		)
		return house.entities.create({
			humanoid: {
				height: 1.75,
				mass: 70,
				radius: 0.5,
			},
			choreography,
			intent,
			gimbal,
			position,
			sensitivity: {
				keys: 10 / 100,
				mouse: 10 / 100,
				stick: 10 / 100,
			},
			speeds: {
				base: 0.5,
				fast: 1.5,
				slow: 0.1,
			},
		})
	},
}

