
import {AnimationGroup} from "@babylonjs/core/Animations/animationGroup.js"

export function anim_title(group: AnimationGroup) {
	const bones = group.targetedAnimations.length
	const frames = Math.round(group.to - group.from)
	return `${bones} bones, ${frames} frames`
}

