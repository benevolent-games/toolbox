
import {html} from "lit"
import {styles} from "./styles.css.js"
import {Engine} from "@babylonjs/core/Engines/engine.js"
import {MagicElement, mixinCss} from "@chasemoskal/magical"

@mixinCss(styles)
export class BenevTheater extends MagicElement {
	realize () {
		return html`
			<div class="theater__wrapper">
				<slot></slot>
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
