import { MagicElement, mixinCss, UseElement } from "@chasemoskal/magical";
import { html, TemplateResult } from "lit-html";
import { property } from "lit/decorators.js";
import {styles} from "./index.css.js"
@mixinCss(styles)
export class BenevCheckbox extends MagicElement {
	@property({type: Boolean})
	checked = false
	
	#handleChange = (event: Event) => {
		this.checked = (event.target as HTMLInputElement).checked
		this.dispatchEvent(new CustomEvent("change", {
			bubbles: true,
			detail: this.checked
		}))
	}

	realize(use: UseElement<this>): void | TemplateResult<1 | 2> {
		return html`
			<input type="checkbox" ?checked=${this.checked} @change=${this.#handleChange}>
			<slot></slot>
		`
	}
}
