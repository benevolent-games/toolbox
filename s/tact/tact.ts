
import {Input} from "./types/input.js"
import {Modes} from "./parts/modes.js"
import {Inputs} from "./types/inputs.js"
import {Devices} from "./parts/devices.js"
import {Bindings} from "./types/bindings.js"
import {Keyboard} from "./devices/keyboard.js"
import {MouseButtons} from "./devices/mouse_buttons.js"
import {consider_input} from "./parts/consider_input.js"
import {establish_inputs} from "./parts/establish_inputs.js"
import {PointerMovements} from "./devices/pointer_movements.js"
import {BindingsHelpers, bindings_helpers} from "./parts/bindings_helpers.js"
import {unstick_stuck_keys, unstick_stuck_keys_for_mode} from "./parts/unstick.js"

export * from "./types/input.js"

export class Tact<B extends Bindings.Catalog> {
	static devices = {Keyboard, MouseButtons, PointerMovements}

	static bindings<B extends Bindings.Catalog>(fn: (h: BindingsHelpers) => B) {
		return fn(bindings_helpers)
	}

	readonly devices: Devices
	readonly inputs: Inputs<B>
	readonly modes = new Modes<Bindings.Mode<B>>()
	readonly considerInput: (input: Input.Whatever) => void

	constructor(target: EventTarget, public bindings: B) {
		this.inputs = establish_inputs(bindings)
		this.considerInput = consider_input(bindings, this.modes, this.inputs)
		this.devices = new Devices(this.considerInput)
		this.modes.onDisabled(mode => unstick_stuck_keys_for_mode(this.inputs, mode))
		target.addEventListener("blur", () => unstick_stuck_keys(this.inputs))
	}
}

