
import {Anim} from "./anim.js"

export class BasedAnim extends Anim {
	init() {
		this.weight = 0
		this.group?.start(true)
	}
}

