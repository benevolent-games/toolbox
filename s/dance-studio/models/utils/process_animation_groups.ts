
import {Pojo} from "@benev/slate"
import {AnimationGroup} from "@babylonjs/core/Animations/animationGroup.js"

import {fix_animation_quaternions} from "./fix_animation_quaternions.js"

export function process_animation_groups(groups: AnimationGroup[]) {

	const anims: Pojo<AnimationGroup> = Object.fromEntries(
		groups
			.map(group => {
				group.stop()
				group.reset()
				return group
			})
			.map(group => {
				fix_animation_quaternions(group)
				return group
			})
			.map(group => [group.name, group])
	)

	return anims
}

