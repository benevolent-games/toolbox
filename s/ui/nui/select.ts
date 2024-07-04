
import {nexus} from "../nexus.js"
import {css, html} from "@benev/slate"

export const NuiSelect = nexus.shadowView(use => ({
		label, options, selected, set,
	}: {
		label: string
		options: string[]
		selected: string
		set: (option: string) => void
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
		select {
			width: 16em;
			max-width: 100%;
		}
	`)

	const onInput = (event: InputEvent) => {
		const target = event.currentTarget as HTMLInputElement
		set(target.value)
	}

	return html`
		<label>
			<div>
				<span>${label}</span>
			</div>
			<select @input="${onInput}">
				${options.map(option => html`
					<option
						value="${option}"
						?selected="${option === selected}">
						${option}
					</option>
				`)}
			</select>
		</label>
	`
})

