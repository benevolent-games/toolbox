
import {Input} from "../types/input.js"

export function isPressed(input: Input.Button) {
	return input.down && !input.repeat
}

