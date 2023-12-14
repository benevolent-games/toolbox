
import {Impulse} from "../../../impulse/impulse.js"
import {HumanoidBinds, humanoid_binds} from "./binds.js"

export class HumanoidImpulse extends Impulse<HumanoidBinds> {
	devices = {
		keyboard: new HumanoidImpulse.Keyboard(window),
		mouse: new HumanoidImpulse.PointerMovements(window, "mouse"),
	}

	constructor() {
		super({
			binds: humanoid_binds(),
			modes: ["humanoid"],
		})

		for (const device of Object.values(this.devices))
			this.add(device)
	}
}

