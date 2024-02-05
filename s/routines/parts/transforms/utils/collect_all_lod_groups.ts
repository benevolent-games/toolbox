
import {Document} from "@gltf-transform/core"

import {LODs, LodGroup, lod_ratios} from "./lod_details.js"
import {parse_prop_name} from "./parse_prop_name.js"

export function collect_all_lod_groups(document: Document) {
	const groups = new Map<string, LodGroup>()

	function grab(basename: string) {
		let group = groups.get(basename)
		if (!group) {
			group = {
				lods: lod_ratios.map(_ => undefined) as LODs,
				directives: undefined,
			}
			groups.set(basename, group)
		}
		return group
	}

	for (const node of document.getRoot().listNodes()) {
		if (node.getMesh()) {
			const {basename, lod, directives} = parse_prop_name(node.getName())
			const group = grab(basename)
			group.directives = directives
			if (lod !== undefined)
				group.lods[lod] = node
		}
	}

	return groups
}

