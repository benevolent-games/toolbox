
// import {Anim} from "./utils/anim.js"
// import {anim_blueprint} from "./anim_blueprint.js"
import {AnimationGroup} from "@babylonjs/core/Animations/animationGroup.js"

// export type AnimType = (
// 	| "primary"
// 	| "primary_additive"
// 	| "weighted_looper"
// 	| "weighted_looper_additive"
// 	| "base_loop"
// 	| "base_frozen"
// 	| "addy_loop"
// 	| "addy_frozen"
// )

// export type AnimBlueprint<K extends string> = [K, AnimType][]

// export type AnimationGroupMetadata = {original: AnimationGroup}

// export type Anims<K extends string> = {[P in K]: Anim}

// export type BlueprintToAnims<BP extends AnimBlueprint<any>> = (
// 	BP extends AnimBlueprint<infer K>
// 		? Anims<K>
// 		: never
// )

// // export type CharacterAnims = BlueprintToAnims<typeof anim_blueprint>

/////////////////////////////////

export function asAnimationBlueprint<K extends string>(blueprint: K[]) {
	return blueprint
}

export type AnimationCollection<K extends string> = {
	[P in K]: AnimationGroup | undefined
}

