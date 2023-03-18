
import {NubContext} from "@benev/nubs"
import {Speeds} from "../../../trajectory/types/speeds.js"
import {get_user_movement_modifiers} from "./get_user_movement_modifiers.js"
import {select_speed_based_on_modifiers} from "../../../trajectory/utils/select_speed_based_on_modifiers.js"

export function get_user_vertical_movement_based_on_keys(
		nub_context: NubContext,
		speeds: Speeds,
	) {

	const speed = select_speed_based_on_modifiers(
		get_user_movement_modifiers(nub_context),
		speeds,
	)

	const jump = nub_context.effects.key.jump?.pressed ?? false
	const crouch = nub_context.effects.key.crouch?.pressed ?? false

	let y = 0

	if (jump)
		y += speed

	if (crouch)
		y -= speed

	return y
}
