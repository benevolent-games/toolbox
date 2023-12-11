
import {AnimLibrary, AnimType} from "./types.js"
import {AnimationGroup} from "@babylonjs/core/Animations/animationGroup.js"

export function activate_animations<K extends string>(
		anims: AnimLibrary,
		instructions: [K, AnimType][],
	) {

	return Object.fromEntries(
		instructions
			.filter(([key]) => key in anims)
			.map(([key, type], index) => {
				const anim = anims[key as any]!
				anim.playOrder = index

				if (type === "primary") {
					anim.play()
					anim.pause()
					anim.goToFrame(0)
				}
				else if (type === "weighted_looper") {
					anim.weight = 0
					anim.start(true, 1)
				}

				return [key, anim]
			})
	) as {[P in K]?: AnimationGroup}
}

