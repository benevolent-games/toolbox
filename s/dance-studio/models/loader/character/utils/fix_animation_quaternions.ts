
import {Quaternion} from "@babylonjs/core/Maths/math.vector.js"
import {Animation} from "@babylonjs/core/Animations/animation.js"
import {AnimationGroup} from "@babylonjs/core/Animations/animationGroup.js"

export function fix_animation_quaternions(group: AnimationGroup) {
	for (const targeted of group.targetedAnimations) {
		const {animation} = targeted

		if (animation.dataType === Animation.ANIMATIONTYPE_QUATERNION) {
			const keys = animation.getKeys()

			// Normalize the first keyframe's quaternion
			if (keys.length > 0 && keys[0].value instanceof Quaternion) {
				keys[0].value.normalize()

				for (let i = 1; i < keys.length; i++) {
					if (keys[i].value instanceof Quaternion) {

						// Normalize the quaternion
						keys[i].value.normalize()

						// Check phase and flip if necessary
						if (Quaternion.Dot(keys[i - 1].value, keys[i].value) < 0)
							keys[i].value.scaleInPlace(-1)
					}
				}

				// Update the animation with the adjusted keyframes
				animation.setKeys(keys)
			}
		}
	}
}

