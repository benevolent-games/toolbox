
import {fix_animation_quaternions} from "./fix_animation_quaternions.js"
import {AnimationGroup} from "@babylonjs/core/Animations/animationGroup.js"

export function fix_animation_groups(groups: AnimationGroup[]) {
	for (const group of groups) {
		group.stop()
		group.reset()
		fix_animation_quaternions(group)
	}
}

