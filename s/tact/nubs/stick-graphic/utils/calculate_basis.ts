
import {Basis} from "../types/basis.js"

export function calculate_basis(
		base: HTMLElement,
		over: HTMLElement,
	): Basis {

	const rect = base.getBoundingClientRect()

	const half_base = (rect.width / 2)
	const quarter_stick = (over.getBoundingClientRect().width / 4)

	return {
		rect,
		radius: half_base - quarter_stick,
	}
}

