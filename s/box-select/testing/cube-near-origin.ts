
import {Scene} from "@babylonjs/core/scene.js"
import {Vector3} from "@babylonjs/core/Maths/math.vector.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"

export function cubeNearOrigin(scene: Scene) {
	const cube = MeshBuilder.CreateBox("cube", {size: 1}, scene)
	cube.position = new Vector3(1, 2, 3)
	return cube
}
