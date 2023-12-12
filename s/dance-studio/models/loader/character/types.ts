
import {Anim} from "./utils/anim.js"
import {AnimationGroup} from "@babylonjs/core/Animations/animationGroup.js"

export type AnimType = "primary" | "weighted_looper"

export type AnimBlueprint<K extends string> = [K, AnimType][]

export type AnimationGroupMetadata = {original: AnimationGroup}

export type Anims<K extends string> = {[P in K]: Anim}

export type BlueprintToAnims<BP extends AnimBlueprint<any>> = (
	BP extends AnimBlueprint<infer K>
		? Anims<K>
		: never
)

