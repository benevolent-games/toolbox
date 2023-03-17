
import {Scene} from "@babylonjs/core/scene.js"
import {Color3} from "@babylonjs/core/Maths/math.color.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"
import {PBRMaterial} from "@babylonjs/core/Materials/PBR/pbrMaterial.js"

import {v3, V3} from "../utils/v3.js"
import {range} from "../utils/range.js"
import {r, seed} from "../utils/randomly.js"

export function spawn_boxes(scene: Scene) {
	const material = new PBRMaterial("material", scene)
	material.albedoColor = new Color3(0.8, 0.8, 0.8)
	material.roughness = 0.5
	material.metallic = 0.5

	const randomly = r(seed(4))

	function rand() {
		const sign = randomly.flip(0.5)
		const coordinate = randomly.between(5, 20)
		return sign
			? coordinate
			: -coordinate
	}

	function make_a_random_box() {
		const position: V3 = [rand(), rand(), rand()]
		const box = MeshBuilder.CreateBox("box", {size: 2}, scene)
		box.material = material
		box.position = v3.toBabylon(position)
	}

	for (const i of range(200))
		make_a_random_box()
}
