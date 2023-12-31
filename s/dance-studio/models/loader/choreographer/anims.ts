
import {ob} from "@benev/slate"
import {anim_blueprint} from "../character/anim_blueprint.js"
import {CharacterAnimationCollection} from "../character/instance.js"
import {AnimationGroup} from "@babylonjs/core/Animations/animationGroup.js"

export type ChoreographerAnims = ReturnType<typeof prepare_anims>

export function prepare_anims(collection: CharacterAnimationCollection) {
	apply_play_order(collection)

	return cook_anims(collection, {
		stand_stationary: g => new BasedAnim(g),
		stand_unequipped_sprint_forward: g => new BasedAnim(g),
		spine_tilt_forwardsbackwards: g => new ManualAdditiveAnim(g, 700),
	})
}

///////////////////////////
///////////////////////////

export function apply_play_order(collection: CharacterAnimationCollection) {
	anim_blueprint.forEach((name, index) => {
		const [,group] = Object.entries(collection)
			.find(([key]) => key === name) ?? []

		if (group)
			group.playOrder = index
	})
}

export type AnimCooker = {
	[P in keyof CharacterAnimationCollection]: (
		(group?: AnimationGroup) => Anim
	)
}

function cook_anims<A extends AnimCooker>(
		collection: CharacterAnimationCollection,
		a: A,
	) {
	return ob(a).map((fn: any, name) => fn(collection[name])) as {
		[P in keyof A]: A[P] extends (...args: any[]) => infer R
			? R
			: never
	}
}

export abstract class Anim {
	abstract init(): void
	constructor(public group: AnimationGroup | undefined) {
		this.init()
	}

	get is_available() {
		return !!this.group
	}

	get from() {
		return this.group?.from ?? 0
	}

	get to() {
		return this.group?.to ?? 0
	}

	get weight() {
		return this.group?.weight ?? 0
	} set weight(n: number) {
		if (this.group)
			this.group.weight = n
	}

	get speedRatio() {
		return this.group?.speedRatio ?? 1
	} set speedRatio(n: number) {
		if (this.group)
			this.group.speedRatio = n
	}
}

export class BasedAnim extends Anim {
	init() {
		this.weight = 0
		this.group?.start(true)
	}
}

export class ManualAdditiveAnim extends Anim {
	constructor(group: AnimationGroup | undefined, referenceFrame: number) {
		super(group)
		if (group) {
			this.group = AnimationGroup.MakeAnimationAdditive(group, {
				referenceFrame,
			})
		}
	}

	forceFrame(frame: number) {
		this.group?.stop()
		this.group?.start(true, this.speedRatio, frame, frame)
	}

	init() {
		this.weight = 0
		this.forceFrame(this.from)
	}
}

