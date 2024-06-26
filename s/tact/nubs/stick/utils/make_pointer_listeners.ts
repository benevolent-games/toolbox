
import {litListener} from "@benev/slate"
import {Vec2} from "../../../../math/vec2.js"

export function make_pointer_listeners({
		set_vector,
		set_pointer_position,
	}: {
		set_vector: (vector: Vec2) => void
		set_pointer_position: (position: Vec2) => void
	}) {

	let pointer_id: number | undefined

	return {
		pointerdown: litListener<PointerEvent>({
			handleEvent: event => {
				event.preventDefault()

				const element = event.currentTarget as HTMLElement

				if (pointer_id)
					element.releasePointerCapture(pointer_id)

				pointer_id = event.pointerId
				element.setPointerCapture(pointer_id)
				set_pointer_position([event.clientX, event.clientY])
				set_vector([0, 0])
			},
		}),

		pointermove: litListener<PointerEvent>({
			passive: false,
			handleEvent: event => {
				event.preventDefault()

				if (event.pointerId === pointer_id)
					set_pointer_position([event.clientX, event.clientY])
			},
		}),

		pointerup: litListener<PointerEvent>({
			handleEvent: event => {
				event.preventDefault()
				pointer_id = undefined
				set_vector([0, 0])
			},
		}),
	}
}

