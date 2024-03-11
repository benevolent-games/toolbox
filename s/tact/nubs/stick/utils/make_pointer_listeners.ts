
import {FancyEventListener} from "@benev/slate"
import {Vec2} from "../../../../math/vec2.js"

function asEventListener<E extends Event>(listener: FancyEventListener<E>) {
	return listener
}

export function make_pointer_listeners({
		set_vector,
		set_pointer_position,
	}: {
		set_vector: (vector: Vec2) => void
		set_pointer_position: (position: Vec2) => void
	}) {

	let pointer_id: number | undefined

	return {
		pointerdown: asEventListener<PointerEvent>({
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

		pointermove: asEventListener<PointerEvent>({
			passive: false,
			handleEvent: event => {
				event.preventDefault()

				if (event.pointerId === pointer_id)
					set_pointer_position([event.clientX, event.clientY])
			},
		}),

		pointerup: asEventListener<PointerEvent>({
			handleEvent: event => {
				event.preventDefault()
				pointer_id = undefined
				set_vector([0, 0])
			},
		}),
	}
}


// import {FancyEventListener} from "@benev/slate"
// import {Vec2} from "../../../../math/vec2.js"

// function asEventListener<E extends Event>(listener: FancyEventListener<E>) {
// 	return listener
// }

// export function make_pointer_listeners({
// 		get_pointer_capture_element, set_vector, set_pointer_position,
// 	}: {
// 		get_pointer_capture_element: () => HTMLElement
// 		set_vector: (vector: Vec2) => void
// 		set_pointer_position: (position: Vec2) => void
// 	}) {

// 	let pointer_id: number | undefined

// 	return {

// 		pointerdown: asEventListener<PointerEvent>({
// 			handleEvent: event => {
// 				event.preventDefault()

// 				const element = get_pointer_capture_element()

// 				if (pointer_id)
// 					element.releasePointerCapture(pointer_id)

// 				pointer_id = event.pointerId
// 				element.setPointerCapture(pointer_id)
// 				set_pointer_position([event.clientX, event.clientY])
// 				set_vector([0, 0])
// 			},
// 		}),

// 		pointermove: asEventListener<PointerEvent>({
// 			passive: false,
// 			handleEvent: event => {
// 				event.preventDefault()

// 				if (event.pointerId === pointer_id)
// 					set_pointer_position([event.clientX, event.clientY])
// 			},
// 		}),

// 		pointerup: asEventListener<PointerEvent>({
// 			handleEvent: event => {
// 				event.preventDefault()
// 				pointer_id = undefined
// 				set_vector([0, 0])
// 			},
// 		}),
// 	}
// }

