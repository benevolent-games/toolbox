
import {nexus} from "../nexus.js"
import {css, html} from "@benev/slate"
import {Vec3, from} from "../../math/vec3.js"

export const NuiColor = nexus.shadow_view(use => ({
		label, initial_hex_color, set,
	}: {
		label: string
		initial_hex_color: string
		set: ({}: {color: Vec3, hex: string}) => void
	}) => {

	use.name("nui-select")
	use.styles(css`
		label {
			display: flex;
			flex-direction: column;
			user-select: none;
		}
		div {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			gap: 0.5em;
		}
	`)

	const onInput = (event: InputEvent) => {
		const target = event.currentTarget as HTMLInputElement
		const hex = target.value
		const color = from.hexcolor(hex)
		set({color, hex})
	}

	return html`
		<label>
			<div>
				<span>${label}</span>
			</div>
			<input type="color" @input="${onInput}" value="${initial_hex_color}"/>
		</label>
	`
})

