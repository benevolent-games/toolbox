
import {Inputs} from "../types/inputs.js"
import {Bindings} from "../types/bindings.js"

export function unstick_stuck_keys_for_mode<B extends Bindings.Catalog>(inputs: Inputs<B>, mode: keyof B) {
	for (const button of Object.values(inputs[mode].buttons)) {
		if (button.input.down === true) {
			button.input = {
				...button.input,
				down: false,
				event: null,
				repeat: false,
			}
			button.on.publish(button.input)
		}
	}
}

export function unstick_stuck_keys<B extends Bindings.Catalog>(inputs: Inputs<B>) {
	Object.keys(inputs).forEach(mode => unstick_stuck_keys_for_mode(inputs, mode))
}

