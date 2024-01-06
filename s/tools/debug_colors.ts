
import {generate_id} from "@benev/slate"
import {Scene} from "@babylonjs/core/scene.js"
import {StandardMaterial} from "@babylonjs/core"
import {Color3} from "@babylonjs/core/Maths/math.color.js"
import {PBRMaterial} from "@babylonjs/core/Materials/PBR/pbrMaterial.js"

export type DebugColors = ReturnType<typeof debug_colors>

export const debug_colors = (scene: Scene) => {
	const X = 1
	const o = .2
	const _ = .4
	return {
		red: std(scene, [X, o, o, _]),
		blue: std(scene, [o, o, X, _]),
		cyan: std(scene, [o, X, X, _]),
		green: std(scene, [o, X, o, _]),
	}
}

//////////////////////////////////
//////////////////////////////////

function pbr(
		scene: Scene,
		[r, g, b, a]: [number, number, number, number],
	) {

	const material = new PBRMaterial(
		`pbr::${generate_id()}`,
		scene,
	)

	material.albedoColor = new Color3(r, g, b)
	material.metallic = 0
	material.roughness = 1
	material.alpha = a

	return material
}

function std(
		scene: Scene,
		[r, g, b, a]: [number, number, number, number],
	) {

	const material = new StandardMaterial(
		`std::${generate_id()}`,
		scene,
	)

	material.wireframe = true
	material.emissiveColor = new Color3(r, g, b)
	material.disableLighting = true
	material.alpha = a

	return material
}

