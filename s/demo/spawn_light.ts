
import {V3, v3} from "../utils/v3.js"
import {Scene} from "@babylonjs/core/scene.js"
import {Vector3} from "@babylonjs/core/Maths/math.vector.js"
import {HemisphericLight} from "@babylonjs/core/Lights/hemisphericLight.js"

export function spawn_light(scene: Scene, direction: V3) {
	const vector = new Vector3(...v3.normalize(direction))
	const light = new HemisphericLight("light", vector, scene)
	light.intensity = 2
}
