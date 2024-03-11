
import {Input} from "./types/input.js"
import {Modes} from "./parts/modes.js"
import {Inputs} from "./types/inputs.js"
import {Devices} from "./parts/devices.js"
import {Bindings} from "./types/bindings.js"
import {Keyboard} from "./devices/keyboard.js"
import {consider_input} from "./parts/consider_input.js"
import {PointerButtons} from "./devices/pointer_buttons.js"
import {establish_inputs} from "./parts/establish_inputs.js"
import {PointerMovements} from "./devices/pointer_movements.js"
import {BindingsHelpers, bindings_helpers} from "./parts/bindings_helpers.js"

export class Tact<B extends Bindings.Catalog> {
	static devices = {Keyboard, PointerButtons, PointerMovements}
	static bindings<B extends Bindings.Catalog>(fn: (h: BindingsHelpers) => B) {
		return fn(bindings_helpers)
	}

	readonly inputs: Inputs<B>
	readonly devices: Devices
	readonly modes = new Modes<Bindings.Mode<B>>()
	readonly considerInput: (input: Input.Whatever) => void

	constructor(public bindings: B) {
		this.inputs = establish_inputs(bindings)
		this.considerInput = consider_input(bindings, this.modes, this.inputs)
		this.devices = new Devices(this.considerInput)
	}
}

