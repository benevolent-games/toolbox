
import {flat, ob} from "@benev/slate"

import {Input} from "../types/input.js"
import {vec2} from "../../math/exports.js"
import {pubsub} from "../../tools/pubsub.js"
import {Bindings} from "../types/bindings.js"
import {InputButtonHandle, InputHandle, Inputs} from "../types/inputs.js"

export function establish_inputs<B extends Bindings.Catalog>(bindings: B): Inputs<B> {

	function setup_input_handle<I extends Input.Whatever>(input: I): InputHandle<I> {
		return {
			input: flat.state(input),
			on: pubsub<[I]>(),
		}
	}

	return ob(bindings).map(({buttons, vectors}) => ({

		buttons: ob(buttons).map((): InputButtonHandle => {
			const {input, on} = setup_input_handle({
				kind: "button",
				code: "",
				down: false,
				repeat: false,
				mods: {shift: false, ctrl: false, meta: false, alt: false},
				event: null,
			})
			return {
				on,
				input,
				pressed: false,
				onPressed: fn => on(input => {
					if (input.down && !input.repeat)
						fn(input)
				}),
			}
		}),

		vectors: ob(vectors).map(() => ({
			input: flat.state({
				kind: "vector",
				channel: "",
				vector: vec2.zero(),
				event: null,
			}),
			on: pubsub(),
		})),

	})) as Inputs<B>
}

