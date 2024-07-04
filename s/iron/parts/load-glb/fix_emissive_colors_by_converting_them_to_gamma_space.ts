
import {Material} from "@babylonjs/core/Materials/material.js"
import {PBRMaterial} from "@babylonjs/core/Materials/PBR/pbrMaterial.js"

export function fix_emissive_colors_by_converting_them_to_gamma_space(materials: Material[]) {
	for (const material of materials)
		if (material instanceof PBRMaterial)
			material.emissiveColor = material.emissiveColor.toGammaSpace()
}

