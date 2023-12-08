
import {Pojo} from "@benev/slate"
import {fix_animation_quaternions} from "./fix_animation_quaternions.js"
import {AnimationGroup} from "@babylonjs/core/Animations/animationGroup.js"

export function process_animation_groups(groups: AnimationGroup[]) {
	const anims: Pojo<AnimationGroup> = Object.fromEntries(
		groups
			.map(anim => {
				anim.stop()
				anim.reset()
				return anim
			})
			.map(anim => {
				fix_animation_quaternions(anim)
				return anim
			})
			.map(anim => [anim.name, anim])
	)

	return anims
}

