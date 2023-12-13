
import {AnimationGroup} from "@babylonjs/core/Animations/animationGroup.js"

export class Anim {
	#group: AnimationGroup | undefined

	constructor(animationGroup?: AnimationGroup) {
		this.#group = animationGroup
	}

	get is_available() {
		return !!this.#group
	}

	get from() {
		return this.#group?.from ?? 0
	}

	get to() {
		return this.#group?.to ?? 0
	}

	get weight() {
		return this.#group?.weight ?? 0
	}

	set weight(n: number) {
		if (this.#group)
			this.#group.weight = n
	}

	get speedRatio() {
		return this.#group?.speedRatio ?? 1
	}

	set speedRatio(n: number) {
		if (this.#group)
			this.#group.speedRatio = n
	}

	get playOrder() {
		return this.#group?.playOrder ?? 0
	}

	set playOrder(index: number) {
		if (this.#group)
			this.#group.playOrder = index
	}

	goToFrame(frame: number) {
		if (this.#group)
			this.#group.goToFrame(frame)
	}

	start(loop: boolean) {
		if (this.#group)
			this.#group.start(loop)
	}

	play(loop: boolean) {
		if (this.#group)
			this.#group.play(loop)
	}

	pause() {
		if (this.#group)
			this.#group.pause()
	}

	stop() {
		if (this.#group)
			this.#group.stop()
	}

	reset() {
		if (this.#group)
			this.#group.reset()
	}
}

