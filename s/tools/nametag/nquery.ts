
import {nametag} from "./nametag.js"
import {babyloid} from "../babyloid.js"
import {Node} from "@babylonjs/core/node.js"

/** check the nametag of a babylon node or its material. */
export const nquery = (node: Node) => ({

	name: (name: string) => {
		if (nametag(node.name).name === name)
			return true
		else if (
			babyloid.is.meshoid(node) &&
			node.material &&
			nametag(node.material.name).name === name
		) return true
	},

	tag: (param: string) => {
		const nodetag = nametag(node.name)

		if (nodetag.has(param))
			return nodetag.get(param)

		else if (babyloid.is.meshoid(node) && node.material) {
			const materialtag = nametag(node.material.name)
			if (materialtag.has(param))
				return materialtag.get(param)
		}
	},
})

