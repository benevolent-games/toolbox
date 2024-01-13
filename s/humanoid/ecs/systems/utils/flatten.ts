
import {Vec2} from "../../../../tools/math/vec2.js"
import {Vec3} from "../../../../tools/math/vec3.js"

export function flatten([x,,z]: Vec3): Vec2 {
	return [x, z]
}

