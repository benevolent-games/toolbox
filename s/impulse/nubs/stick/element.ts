
import {html} from "@benev/slate"
import {Stick} from "./device.js"
import {slate} from "../slate.js"
import {make_pointer_listeners} from "./utils/make_pointer_listeners.js"
import {calculate_new_vector_from_pointer_position} from "./utils/calculate_new_vector_from_pointer_position.js"
import {Basis} from "../stick-graphic/types/basis.js"
import {NubStickGraphic} from "../stick-graphic/element.js"

export const NubStick = slate.shadow_view({}, use => (stick: Stick) => {

	let basis: Basis | undefined = undefined

	const listeners = use.prepare(() => make_pointer_listeners({
		set_vector: vector => stick.vector = vector,
		set_pointer_position: position => {
			if (basis)
				stick.vector = calculate_new_vector_from_pointer_position(
					basis,
					position,
				)
			else
				console.log("no basis")
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
				[stick.vector, b => basis = b],
				{attrs: {part: "graphic"}},
			)}
		</div>
	`
})

// import {V2} from "../../tools/v2.js"
// import {styles} from "./styles.css.js"
// import {NubCauseEvent} from "../../events/cause.js"
// import {NubStickGraphic} from "../stick-graphic/element.js"
// import {make_pointer_listeners} from "./utils/make_pointer_listeners.js"
// import {calculate_new_vector_from_pointer_position} from "./utils/calculate_new_vector_from_pointer_position.js"

// @mixinCss(styles)
// export class NubStick extends LitElement {

// 	@property({type: String, reflect: true})
// 	cause: string = "Stick"

// 	@query(NubStickGraphic.tag)
// 	private graphic: NubStickGraphic | undefined

// 	@property()
// 	private vector: V2 = [0, 0]

// 	#update_vector_and_dispatch_cause = (vector: V2) => {
// 		this.vector = vector
// 		NubCauseEvent
// 			.target(this)
// 			.dispatch({
// 				vector,
// 				kind: "stick",
// 				cause: this.cause,
// 			})
// 	}

// 	#pointer_listeners = make_pointer_listeners({
// 		get_pointer_capture_element: () => this.graphic!,
// 		set_vector: this.#update_vector_and_dispatch_cause,
// 		set_pointer_position: position => {
// 			this.#update_vector_and_dispatch_cause(
// 				calculate_new_vector_from_pointer_position(
// 					this.graphic!.basis!,
// 					position,
// 				)
// 			)
// 		},
// 	})

// 	render() {
// 		const listeners = this.#pointer_listeners
// 		return html`
// 			<nub-stick-graphic
// 				part=graphic
// 				exportparts="base over under"
// 				.vector=${this.vector}
// 				@pointerdown=${listeners.pointerdown}
// 				@pointermove=${listeners.pointermove}
// 				@pointerup=${listeners.pointerup}
// 			></nub-stick-graphic>
// 		`
// 	}
// }
