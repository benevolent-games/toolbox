
import {nametag} from "./nametag.js"
import {Meshoid} from "../../babyloid/types.js"

export function nametagQuery(mesh: Meshoid, tag: string): true | string | null {
	let value: true | string | null = null
	const meshname = nametag(mesh.name)

	if (meshname.has(tag))
		value = meshname.get(tag)!

	if (mesh.material) {
		const matname = nametag(mesh.material.name)
		if (matname.has(tag))
			value = matname.get(tag)!
	}

	return value
}

