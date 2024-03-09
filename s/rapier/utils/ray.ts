
import {Rapier} from "../rapier.js"
import {Vec3, vec3} from "../../math/exports.js"

export function ray(position: Vec3, direction: Vec3) {
	return new Rapier.Ray(
		vec3.to.xyz(position),
		vec3.to.xyz(direction),
	)
}

