
import {Anim} from "./anim.js"
import {scalar} from "../../../../../../tools/math/scalar.js"
import {AnimationGroup} from "@babylonjs/core/Animations/animationGroup.js"

export class ManualAdditiveAnim extends Anim {
	readonly referenceFrame: number

	constructor(group: AnimationGroup | undefined, referenceFrame: number) {
		super(group)

		this.referenceFrame = referenceFrame

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

	// TODO prefer this over forceFrame??
	forceProgress(fraction: number) {
		const frame = scalar.between(
			fraction,
			this.group?.from ?? 0,
			this.group?.to ?? 100,
		)
		this.group?.stop()
		this.group?.start(true, this.speedRatio, frame, frame)
	}

	init() {
		this.weight = 0
		this.forceFrame(this.referenceFrame)
	}
}

