
import {html} from "@benev/slate"

import {styles} from "./styles.js"
import {nub_nexus} from "../nexus.js"
import {Basis} from "./types/basis.js"
import {transform} from "./utils/transform.js"
import {Vec2, vec2} from "../../../tools/math/vec2.js"
import {calculate_basis} from "./utils/calculate_basis.js"
import {stick_vector_to_pixels} from "./utils/stick_vector_to_pixels.js"

export const NubStickGraphic = nub_nexus.shadow_view(use => (
		vector: Vec2,
		updateBasis: (basis: Basis) => void,
	) => {

	use.name("nub-stick-graphic")
	use.styles(styles)

	const basis = use.afterRender(() => {
		const basis = calculate_basis(
			use.shadow.querySelector<HTMLElement>(`[part="base"]`)!,
			use.shadow.querySelector<HTMLElement>(`[part="over"]`)!,
		)
		updateBasis(basis)
		return basis
	})

	const pixels = stick_vector_to_pixels(basis?.radius, vector)
	const over_style = transform(pixels)
	const under_style = transform(vec2.multiplyBy(pixels, 0.5))

	return html`
		<div part=base>
			<div part=under style="${under_style}"></div>
			<div part=over style="${over_style}"></div>
		</div>
	`
})

