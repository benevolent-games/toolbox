
import {Quat} from "./quat.js"
import {Vec3} from "./vec3.js"
import {Quaternion, Vector3} from "@babylonjs/core/Maths/math.vector.js"

export const babylonian = {
	to: {
		vec3: ({x, y, z}: Vector3): Vec3 => [x, y, z],
		quat: ({x, y, z, w}: Quaternion): Quat => [x, y, z, w],
	},
	from: {
		vec3: (v: Vec3) => new Vector3(...v),
		quat: (q: Quat) => new Quaternion(...q),
	},
}

