
import {Speeds} from "../types/speeds.js"
import {Modifiers} from "../types/modifiers.js"

export function select_speed_based_on_modifiers(
		modifiers: Modifiers,
		speeds: Speeds,
	) {

	return modifiers.fast
		? speeds.fast
		: modifiers.slow
			? speeds.slow
			: speeds.base
}
