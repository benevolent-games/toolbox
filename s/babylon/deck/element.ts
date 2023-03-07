
import {LitElement} from "lit"
import {property} from "lit/decorators.js"

export class Deck extends LitElement {
	babylon: any | undefined

	@property({reflect: true})
	["view-mode"] = "small"

	#settings_controller: any


}
