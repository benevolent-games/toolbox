
import {Input} from "./input.js"
import {Bindings} from "./bindings.js"
import {Pubsub} from "../../tools/pubsub.js"

export type Inputs<B extends Bindings.Catalog> = {
	[M in keyof B]: {
		buttons: {[P in keyof B[M]["buttons"]]: InputButtonHandle}
		vectors: {[P in keyof B[M]["vectors"]]: InputHandle<Input.Vector>}
	}
}

export type InputHandle<I extends Input.Whatever> = {
	input: I
	on: Pubsub<[I]>
}

export type InputButtonHandle = {
	onPressed: (fn: (input: Input.Button) => void) => void
} & InputHandle<Input.Button>

