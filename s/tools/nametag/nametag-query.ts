
import {nametag} from "./nametag.js"
import {Meshoid} from "../../babyloid/types.js"

/** obtain a nametag param on the mesh or its material */
export function nametagQuery(mesh: Meshoid, paramName: string): true | string | null {
	let value: true | string | null = null
	const meshname = nametag(mesh.name)

	if (meshname.has(paramName))
		value = meshname.get(paramName)!

	if (mesh.material) {
		const matname = nametag(mesh.material.name)
		if (matname.has(paramName))
			value = matname.get(paramName)!
	}

	return value
}

