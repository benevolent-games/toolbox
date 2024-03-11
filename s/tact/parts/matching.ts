
import {deep} from "@benev/slate"

import {Input} from "../types/input.js"
import {Bindings} from "../types/bindings.js"

export function input_matches_button(
		input: Input.Button,
		buttons: Bindings.Btn[],
	): boolean {

	return buttons.some(([code, opts]) => {

		// fail to match when wrong code
		if (code !== input.code)
			return false

		// pass when ignoring modifiers
		if ("modless" in opts)
			return true

		// pass when modifiers match exactly
		else
			return deep.equal(opts, input.mods)
	})
}

export function input_matches_vector(
		input: Input.Vector,
		channels: string[],
	) {

	return channels.includes(input.channel)
}

