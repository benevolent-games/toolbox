
import {NubContext} from "@benev/nubs"
import {Modifiers} from "../../../trajectory/types/modifiers.js"

export function get_user_movement_modifiers(
		nub_context: NubContext,
	): Modifiers {

	const {key} = nub_context.effects

	return {
		fast: key.move_fast?.pressed ?? false,
		slow: key.move_slow?.pressed ?? false,
	}
}
