
import {Anim} from "./anim.js"

export class ManualAnim extends Anim {
	forceFrame(frame: number) {
		this.group?.stop()
		this.group?.start(true, this.speedRatio, frame, frame)
	}

	init() {
		this.weight = 0
		this.forceFrame(this.from)
	}
}

