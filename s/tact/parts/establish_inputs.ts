
import {flat, ob} from "@benev/slate"

import {Inputs} from "../types/inputs.js"
import {vec2} from "../../math/exports.js"
import {pubsub} from "../../tools/pubsub.js"
import {Bindings} from "../types/bindings.js"

export function establish_inputs<B extends Bindings.Catalog>(bindings: B): Inputs<B> {
	return ob(bindings).map(({buttons, vectors}) => ({

		buttons: ob(buttons).map(() => ({
			input: flat.state({
				kind: "button",
				code: "",
				down: false,
				repeat: false,
				mods: {shift: false, ctrl: false, meta: false, alt: false},
				event: null,
			}),
			on: pubsub(),
		})),

		vectors: ob(vectors).map(() => ({
			input: flat.state({
				kind: "vector",
				channel: "",
				vector: vec2.zero(),
				event: null,
			}),
			on: pubsub(),
		})),

	})) as any
}

