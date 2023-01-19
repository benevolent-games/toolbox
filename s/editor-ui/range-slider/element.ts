
import {html, LitElement} from "lit"
import {property} from "lit/decorators.js"
import rangeSliderStyles from "./index.css.js"

export class RangeSlider extends LitElement {

	static styles = [rangeSliderStyles]

	@property({type: Number})
	min: number = 0

	@property({type: Number})
	max: number = 10

	@property({type: Number})
	step: number = 0.5

	@property({type: Number})
	"initial-value": number = this.min + (this.max -this.min) / 2

	@property({type: String})
	label: string = "label"

	@property({type: String})
	private inputValue: string = ""

	private get input() {
		return this.shadowRoot
			? this.shadowRoot.querySelector("input")
			: undefined
	}

	get value() {
		return this.input?.value
	}

	#handleInputChange = (event: Event) => {
		const input = event.target as HTMLInputElement
		this.inputValue = input.value
	}

	firstUpdated(): void {
		this.inputValue = `${this["initial-value"]}`
	}

	render() {
		const {min, max, step, label, inputValue} = this
		return html`
			<div class=range >
				<label>
					${label}
				</label>
				<div class=slider >
					<input
						type=range
						.min=${min}
						.max=${max}
						.step=${step}
						.value=${inputValue}
						@input=${this.#handleInputChange}
					/>
					<span>${inputValue}</span>
				</div>
			</div>
		`
	}
}
