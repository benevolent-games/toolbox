
import {nexus} from "./nexus.js"
import {css, html} from "@benev/slate"

export const NuiRange = nexus.shadow_view(use => ({
		label, min, max, step, value, set,
	}: {
		label: string
		min: number
		max: number
		step: number
		value: number
		set: (x: number) => void
	}) => {

	use.name("nui-range")

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

	const codeValue = (
		(value % 1 === 0) ? value :
		(value < 0.2) ? value.toFixed(3) :
		value.toFixed(2)
	)

	return html`
		<label>
			<div>
				<span>${label}</span>
				<code>${codeValue}</code>
			</div>
			<input
				type="range"
				min="${min}"
				max="${max}"
				step="${step}"
				.valueAsNumber="${value}"
				@input="${(event: InputEvent) => {
					const target = event.currentTarget as HTMLInputElement
					set(target.valueAsNumber)
				}}"/>
		</label>
	`
})

