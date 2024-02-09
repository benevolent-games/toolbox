
import {Phys} from "../types.js"
import {quat, vec3} from "../../math/exports.js"

export function synchronize_to_babylon_position_and_rotation(
		{rigid, position, rotation}: Phys.Actor,
	) {
	position.set(...vec3.from.xyz(rigid.translation()))
	rotation.set(...quat.from.xyzw(rigid.rotation()))
}

