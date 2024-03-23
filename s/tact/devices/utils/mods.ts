
import {Input} from "../../tact.js"

export function mods(event: KeyboardEvent | MouseEvent): Input.Modifiers {
	return {
		ctrl: event.ctrlKey,
		meta: event.metaKey,
		alt: event.altKey,
		shift: event.shiftKey,
	}
}

