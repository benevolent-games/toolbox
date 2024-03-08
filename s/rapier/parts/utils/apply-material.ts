
import {Material} from "@babylonjs/core/Materials/material.js"
import {AbstractMesh} from "@babylonjs/core/Meshes/abstractMesh.js"

export function applyMaterial(mesh: AbstractMesh, material: Material | null) {
	mesh.material = material
	if (!material)
		mesh.setEnabled(false)
}

