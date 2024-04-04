
import {Modes} from "./modes.js"
import {Input} from "../types/input.js"
import {Inputs} from "../types/inputs.js"
import {isPressed} from "./is_pressed.js"
import {Bindings} from "../types/bindings.js"
import {input_matches_button, input_matches_vector} from "./matching.js"

export function consider_input<B extends Bindings.Catalog>(
		bindings: B,
		modes: Modes<Bindings.Mode<B>>,
		inputs: Inputs<B>,
	) {
	return (input: Input.Whatever) => {
		for (const mode of modes) {
			const buttons = inputs[mode].buttons
			const vectors = inputs[mode].vectors
			switch (input.kind) {

				case "button": {
					for (const [name, btns] of Object.entries(bindings[mode].buttons)) {
						if (input_matches_button(input, btns)) {
							const handle = buttons[name]
							handle.input = input
							handle.on.publish(input)
							handle.pressed = isPressed(input)
								? input
								: null
						}
					}
				} break

				case "vector": {
					for (const [name, channels] of Object.entries(bindings[mode].vectors)) {
						if (input_matches_vector(input, channels)) {
							const handle = vectors[name]
							handle.input = input
							handle.on.publish(input)
						}
					}
				} break
			}
		}
	}
}

