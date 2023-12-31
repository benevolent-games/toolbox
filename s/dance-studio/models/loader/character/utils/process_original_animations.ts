
// import {Anim} from "./anim.js"
// import {AnimBlueprint, Anims} from "../types.js"
// import {AnimationGroup} from "@babylonjs/core/Animations/animationGroup.js"

// export function process_original_animations<K extends string>(
// 		originalGroups: AnimationGroup[],
// 		blueprint: AnimBlueprint<K>,
// 	) {

// 	for (const group of originalGroups)
// 		group.metadata = {original: group}

// 	return function process_cloned_animations(cloneGroups: AnimationGroup[]) {
// 		const anims = {} as Anims<K>

// 		blueprint.forEach(([key, type], index) => {
// 			const anim = new Anim(
// 				cloneGroups.find(
// 					g => g.metadata.original.name === key
// 				)
// 			)

// 			anim.playOrder = index

// 			if (type === "primary") {
// 				anim.play(false)
// 				anim.pause()
// 				anim.goToFrame(0)
// 			}
// 			else if (type === "primary_additive") {
// 				anim.make_additive()
// 				anim.play(false)
// 				anim.pause()
// 				anim.goToFrame(0)
// 			}
// 			else if (type === "weighted_looper") {
// 				anim.weight = 0
// 				anim.start(true)
// 			}
// 			else if (type === "weighted_looper_additive") {
// 				anim.make_additive()
// 				anim.weight = 0
// 				anim.start(true)
// 			}

// 			///////////////////////////////////
// 			///////////////////////////////////

// 			else if (type === "base_loop") {
// 				anim.weight = 0
// 				anim.start(true)
// 			}
// 			else if (type === "base_frozen") {
// 				anim.weight = 0
// 				anim.start(true, 1, 0, 0)
// 				// anim.play(false)
// 				// anim.goToFrame(0)
// 				// anim.pause()
// 			}

// 			else if (type === "addy_loop") {
// 				anim.make_additive()
// 				anim.weight = 0
// 				anim.start(true)
// 			}
// 			else if (type === "addy_frozen") {
// 				anim.make_additive()
// 				anim.weight = 0
// 				anim.play(false)
// 				anim.pause()
// 				anim.goToFrame(0)
// 			}

// 			anims[key] = anim
// 		})

// 		return anims
// 	}
// }

