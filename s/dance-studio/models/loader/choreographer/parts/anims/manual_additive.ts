
import {Anim} from "./anim.js"
import {AnimationGroup} from "@babylonjs/core/Animations/animationGroup.js"

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

