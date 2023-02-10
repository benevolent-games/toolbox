
import {Color3} from "@babylonjs/core/Maths/math.color.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"
import {PBRMaterial} from "@babylonjs/core/Materials/PBR/pbrMaterial.js"

import {v3, V3} from "../utils/v3.js"
import {range} from "../utils/range.js"
import {r, seed} from "../utils/randomly.js"
import {Scene} from "@babylonjs/core/scene.js"

export function spawnBoxes(scene: Scene) {
	const material = new PBRMaterial("material", scene)
	material.albedoColor = new Color3(0.8, 0.8, 0.8)
	material.roughness = 0.5
	material.metallic = 0.5

	// const ground = MeshBuilder.CreateGround("ground", {
	// 	width: 10,
	// 	height: 10,
	// 	subdivisions: 4,
	// }, scene)
	// ground.material = material

	function makeBox(position: V3) {
		const box = MeshBuilder.CreateBox("box", {size: 2}, scene)
		box.material = material
		box.position = v3.toBabylon(position)
	}

	const randomly = r(seed(4))

	function rand() {
		return randomly.between(-10, 10)
	}

	for (const i of range(50)) {
		makeBox([rand(), rand(), rand()])
	}
}
