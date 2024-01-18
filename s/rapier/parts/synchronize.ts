
import {Phys} from "../types.js"
import {quat} from "../../tools/math/quat.js"
import {vec3} from "../../tools/math/vec3.js"

export function synchronize_to_babylon_position_and_rotation(
		{rigid, position, rotation}: Phys.Actor,
	) {
	position.set(...vec3.from.xyz(rigid.translation()))
	rotation.set(...quat.from.xyzw(rigid.rotation()))
}

