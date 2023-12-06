
import {NubEffectEvent} from "@benev/nubs"
import {V2, v2} from "../../../utils/v2.js"
import {invert_y_axis} from "./inversions.js"

export function add_user_pointer_movements_to_look({
	 	effect,
		sensitivity,
		cause_to_use_when_pointer_not_locked,
		add_look,
		is_pointer_locked,
	}: {
		effect: string
		sensitivity: number
		cause_to_use_when_pointer_not_locked: string
		add_look: (vector: V2) => void
		is_pointer_locked: () => boolean
	}) {

	return ({detail}: NubEffectEvent) => {
		const is_pointer_kind = detail.kind === "pointer"
		const is_matching_effect = detail.effect === effect
		const is_considerable = (
			is_pointer_locked() ||
			detail.cause === cause_to_use_when_pointer_not_locked
		)

		if (is_pointer_kind && is_matching_effect && is_considerable)
			add_look(
				invert_y_axis(
					v2.multiplyBy(detail.movement, sensitivity)
				)
			)
	}
}
