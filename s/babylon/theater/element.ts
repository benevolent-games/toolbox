
import {html} from "lit"
import {styles} from "./styles.css.js"
import {Engine} from "@babylonjs/core/Engines/engine.js"
import {MagicElement, mixinCss, UseElement} from "@chasemoskal/magical"
import {ViewModeButton} from "./views/view-mode-button.js"
import {property} from "lit/decorators.js"


export type ViewMode = "embed" | "cinema" | "fullscreen"
@mixinCss(styles)
export class BenevTheater extends MagicElement {

	@property({reflect: true})
	["view-mode"]: ViewMode = "embed"

	#setViewMode = (mode: ViewMode) => {
		this["view-mode"] = mode
	}

	realize(use: UseElement<typeof this>) {
		return html`
			<div class="theater__wrapper">
				<slot></slot>
				<div class"buttonbar">
					${ViewModeButton(this["view-mode"], this.#setViewMode)}
				</div>
				<div class="panel">
					<p>60</p>
				</div>
			</div>
		`
	}
}

export function makeElement(canvas: HTMLElement) {
	const element = document.createElement("benev-theater")
	element.appendChild(canvas)
	return element
}
