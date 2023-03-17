
import {V3, v3} from "../utils/v3.js"
import {Scene} from "@babylonjs/core/scene.js"
import {Vector3} from "@babylonjs/core/Maths/math.vector.js"
import {DirectionalLight} from "@babylonjs/core/Lights/directionalLight.js"

export function spawn_light(scene: Scene, direction: V3) {
	const vector = new Vector3(...v3.normalize(direction))
	return new DirectionalLight("light", vector, scene)

	// // TODO remove, obsolete
	// light.position = v3.toBabylon(
	// 	v3.multiplyBy(
	// 		v3.negate(v3.fromBabylon(direction)),
	// 		10,
	// 	)
	// )
}
