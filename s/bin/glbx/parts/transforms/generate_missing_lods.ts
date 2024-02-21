
// import {Document} from "@gltf-transform/core"
// import {MeshoptSimplifier} from "meshoptimizer"
// import {simplifyPrimitive, weldPrimitive} from "@gltf-transform/functions"

// import {Counter} from "./utils/counter.js"
// import {clone_node} from "./utils/clone_node.js"
// import {lod_ratios} from "./utils/lod_details.js"
// import {collect_all_lod_groups} from "./utils/collect_all_lod_groups.js"

// export const generate_missing_lods = () => (document: Document) => {
// 	const counter = new Counter()

// 	for (const [basename, {lods}] of collect_all_lod_groups(document)) {
// 		const top_index = lods.findIndex(n => !!n)

// 		if (top_index === -1) {
// 			console.warn(`missing lod index for "${basename}"`)
// 			continue
// 		}

// 		const top_node = lods[top_index]!
// 		const top_ratio = lod_ratios[top_index]!

// 		// // backfill high quality lods
// 		// for (let i = 0; i < top_index; i++) {
// 		// 	const name = `${basename}#${i}`
// 		// 	lods[i] = clone_node(document, counter, top_node, name)
// 		// }

// 		// fillforward lower quality lods
// 		for (let i = top_index + 1; i < lod_ratios.length; i++) {
// 			const current_ratio = lod_ratios[i]
// 			const target_ratio = current_ratio / top_ratio
// 			const node = lods[i]
// 			if (!node) {
// 				const name = `${basename}#${i}`
// 				const new_node = clone_node(document, counter, top_node, name)
// 				const new_mesh = new_node.getMesh()!
// 				// const before = count_number_of_vertices(new_mesh)

// 				for (const primitive of new_mesh.listPrimitives()) {
// 					if (i >= 1)
// 						weldPrimitive(document, primitive, {tolerance: 0.001, overwrite: true, exhaustive: true, toleranceNormal: 0.5})

// 					simplifyPrimitive(document, primitive, {
// 						error: 1,
// 						lockBorder: false,
// 						ratio: target_ratio * 3,
// 						simplifier: MeshoptSimplifier,
// 					})
// 				}

// 				// const after = count_number_of_vertices(new_mesh)
// 				lods[i] = new_node
// 			}
// 		}
// 	}
// }

