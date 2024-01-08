
import {theme} from "../common/theme.js"
import {Nexus, css, html} from "@benev/slate"

const nexus = new Nexus(new class {theme = theme})

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

	return html`
		<label>
			<div>
				<span>${label}</span>
				<code>${value % 1 === 0 ? value : value.toFixed(2)}</code>
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

