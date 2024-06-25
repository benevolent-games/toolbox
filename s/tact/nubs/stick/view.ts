
import {html} from "@benev/slate"

import {Stick} from "./device.js"
import {styles} from "./styles.js"
import {nub_nexus} from "../nexus.js"
import {Basis} from "../stick-graphic/types/basis.js"
import {NubStickGraphic} from "../stick-graphic/view.js"
import {make_pointer_listeners} from "./utils/make_pointer_listeners.js"
import {calculate_new_vector_from_pointer_position} from "./utils/calculate_new_vector_from_pointer_position.js"

export const NubStick = nub_nexus.shadowView(use => (stick: Stick) => {
	use.name("nub-stick")
	use.styles(styles)

	let basis: Basis | undefined = undefined
	const updateBasis = (b: Basis) => basis = b

	const listeners = use.once(() => make_pointer_listeners({
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
			class=container
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

