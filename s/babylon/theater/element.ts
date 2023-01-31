
import {html} from "lit"
import {styles} from "./styles.css.js"
import {MagicElement, mixinCss} from "@chasemoskal/magical"

@mixinCss(styles)
export class BenevTheater extends MagicElement {
	realize () {
		return html`
			<slot></slot>
		`
	}
}

export function makeElement(canvas: HTMLElement) {
	const element = document.createElement("benev-theater")
	element.appendChild(canvas)
	
	return element
}
