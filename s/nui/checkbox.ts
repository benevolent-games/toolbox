
import {nexus} from "./nexus.js"
import {css, html} from "@benev/slate"

export const NuiCheckbox = nexus.shadow_view(use => ({
		label, checked, set,
	}: {
		label: string
		checked: boolean
		set: (c: boolean) => void
	}) => {

	use.name("nui-checkbox")

	use.styles(css`
		label {
			display: flex;
			gap: 0.5em;
			> input { order: -1; }
		}
	`)

	return html`
		<label>
			<span>${label}</span>
			<input
				type="checkbox"
				.checked="${checked}"
				@input="${(event: InputEvent) => {
					const target = event.currentTarget as HTMLInputElement
					set(target.checked)
				}}"/>
		</label>
	`
})

