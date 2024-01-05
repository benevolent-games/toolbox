
import type {Rapier} from "../rapier.js"
import {vec3} from "../../tools/math/vec3.js"

export function gravitation(world: Rapier.World) {
	return vec3.multiplyBy(
		vec3.from.xyz(world.gravity),
		world.timestep,
	)
}

