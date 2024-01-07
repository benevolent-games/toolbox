
import {generate_id, ob} from "@benev/slate"
import {Scene} from "@babylonjs/core/scene.js"
import {StandardMaterial} from "@babylonjs/core"
import {Color3} from "@babylonjs/core/Maths/math.color.js"
import {PBRMaterial} from "@babylonjs/core/Materials/PBR/pbrMaterial.js"

export type DebugColors = ReturnType<typeof debug_colors>
type Vec4 = [number, number, number, number]

export const debug_colors = (scene: Scene) => {
	const X = 1
	const _ = .2
	const a = .4
	const bases = {
		red:     [X, _, _, a] as Vec4,
		yellow:  [X, X, _, a] as Vec4,
		green:   [_, X, _, a] as Vec4,
		cyan:    [_, X, X, a] as Vec4,
		blue:    [_, _, X, a] as Vec4,
		magenta: [X, _, X, a] as Vec4,
	}
	return {
		...ob(bases).map(vector => pbr_material(scene, vector)),
		wireframe: ob(bases).map(vector => wireframe_material(scene, vector)),
	}
}

//////////////////////////////////
//////////////////////////////////

function pbr_material(
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

function wireframe_material(
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

