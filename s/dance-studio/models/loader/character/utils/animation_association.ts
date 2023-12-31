
import {fix_animation_groups} from "./fix_animation_groups.js"
import {AnimationGroup} from "@babylonjs/core/Animations/animationGroup.js"

export const animation_association = {

	/**
	 * fix animation groups.
	 */
	fix(groups: AnimationGroup[]) {
		fix_animation_groups(groups)
	},

	/**
	 * babylon will mangle the names of cloned animation groups.
	 * so we attach a reference to the original animation group
	 * to the metadata (the metadata is copied to the clones)
	 * so that from our clones we can recover the original names.
	 */
	mark(originalGroups: AnimationGroup[]) {
		for (const group of originalGroups)
			group.metadata = {original: group}
	},

	/**
	 * get a cloned animation group by it's original name.
	 */
	recover(clonedGroups: AnimationGroup[], name: string) {
		return clonedGroups.find(g => g.metadata.original.name === name)
	},
}

