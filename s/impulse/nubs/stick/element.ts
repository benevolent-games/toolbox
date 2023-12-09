
import {html} from "@benev/slate"

import {Stick} from "./device.js"
import {slate} from "../slate.js"
import {Basis} from "../stick-graphic/types/basis.js"
import {NubStickGraphic} from "../stick-graphic/element.js"
import {make_pointer_listeners} from "./utils/make_pointer_listeners.js"
import {calculate_new_vector_from_pointer_position} from "./utils/calculate_new_vector_from_pointer_position.js"

export const NubStick = slate.shadow_view({}, use => (stick: Stick) => {

	let basis: Basis | undefined = undefined
	const updateBasis = (b: Basis) => basis = b

	const listeners = use.prepare(() => make_pointer_listeners({
		set_vector: vector => stick.vector = vector,
		set_pointer_position: position => {
			if (basis)
				stick.vector = calculate_new_vector_from_pointer_position(
					basis,
					position,
				)
		},
	}))

	return html`
		<div
			part=container
			.vector="${stick.vector}"
			@pointerdown="${listeners.pointerdown}"
			@pointermove="${listeners.pointermove}"
			@pointerup="${listeners.pointerup}"
			>
			${NubStickGraphic(
				[stick.vector, updateBasis],
				{attrs: {part: "graphic"}},
			)}
		</div>
	`
})

