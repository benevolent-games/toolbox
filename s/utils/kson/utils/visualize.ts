
import {controls} from "../text/controls.js"

export function visualize(text: string) {
	for (const [label, character] of Object.entries(controls))
		text = text.replaceAll(character, `(${label})`)
	return text
}
