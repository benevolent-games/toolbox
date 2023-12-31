
import {AnimationCollection} from "../types.js"
import {fix_animation_groups} from "./fix_animation_groups.js"
import {AnimationGroup} from "@babylonjs/core/Animations/animationGroup.js"

export const animation_association = {

	/**
	 * fix animation groups
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
	 * organize cloned animation groups into a collection based on a blueprint.
	 */
	recover<K extends string>(clonedGroups: AnimationGroup[], blueprint: K[]) {
		const anims = {} as AnimationCollection<K>

		for (const key of blueprint) {
			anims[key] = clonedGroups.find(g => {
				if (!g.metadata.original)
					throw new Error(`animation group "${g.name}" was not marked for association (missing metadata.original)`)

				return g.metadata.original.name === key
			})
		}

		return anims
	},
}

