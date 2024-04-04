
import {el, ev, html} from "@benev/slate"

import {styles} from "./styles.js"
import {nub_nexus} from "../nexus.js"
import {Movements} from "../../devices/movements.js"
import {lookpad_listeners} from "./utils/listeners.js"

export const NubLookpad = nub_nexus.shadow_view(use => (device: Movements) => {
	use.name("nub-lookpad")
	use.styles(styles)

	const pad = use.once(() => {
		const pad = el("div", {class: "pad"})
		ev(pad, lookpad_listeners({
			get_pointer_capture_element: () => pad,
			on_pointer_drag: event => device.dispatch({
				event,
				vector: [event.movementX, event.movementY],
			}),
		}))
		return pad
	})

	return html`${pad}`
})

