
import {html} from "lit"

import {slate} from "../slate.js"
import {styles} from "./styles.js"
import {Basis} from "./types/basis.js"
import {transform} from "./utils/transform.js"
import {Vec2, vec2} from "../../../tools/math/vec2.js"
import {calculate_basis} from "./utils/calculate_basis.js"
import {stick_vector_to_pixels} from "./utils/stick_vector_to_pixels.js"

export const NubStickGraphic = slate.shadow_view(
	{styles},
	use => (vector: Vec2, updateBasis: (basis: Basis) => void) => {

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

// @mixinCss(styles)
// export class NubStickGraphicOld extends LitElement {
// 	static tag = "nub-stick-graphic"

// 	@property()
// 	vector: V2 = [0, 0]

// 	@query(`[part="base"]`)
// 	private base?: HTMLElement

// 	@query(`[part="over"]`)
// 	private over?: HTMLElement

// 	get basis(): Basis | undefined {
// 		return calculate_basis(this.base, this.over)
// 	}

// 	render() {
// 		const {basis, vector} = this
// 		const [x, y] = stick_vector_to_pixels(basis?.radius, vector)

// 		const over_style = transform(x, y)
// 		const under_style = transform(x * 0.5, y * 0.5)

// 		return html`
// 			<div part=base>
// 				<div part=under style="${under_style}"></div>
// 				<div part=over style="${over_style}"></div>
// 			</div>
// 		`
// 	}
// }

