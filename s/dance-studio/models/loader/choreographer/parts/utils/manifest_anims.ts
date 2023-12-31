
import {Anim} from "../anims/anim.js"
import {Pojo, ob} from "@benev/slate"
import {AnimationGroup} from "@babylonjs/core/Animations/animationGroup.js"

export type AnimManifestFn<A extends Anim> = (group: AnimationGroup | undefined) => A
export type AnimManifest = Pojo<AnimManifestFn<Anim>>

export function manifest_anims<M extends Pojo<AnimManifestFn<Anim>>>(
		manifest: M,
		getAnimationGroup: (name: keyof M) => (AnimationGroup | undefined)
	) {

	// set play order
	Object.keys(manifest).forEach((name, index) => {
		const group = getAnimationGroup(name)
		if (group)
			group.playOrder = index
	})

	// instantiate anim classes
	return ob(manifest).map((fn, name) => fn(getAnimationGroup(name))) as {
		[P in keyof M]: M[P] extends AnimManifestFn<infer Anim>
			? Anim
			: never
	}
}

