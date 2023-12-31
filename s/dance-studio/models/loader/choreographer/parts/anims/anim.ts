
import {AnimationGroup} from "@babylonjs/core/Animations/animationGroup.js"

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

