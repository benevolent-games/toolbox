
import {pub} from "@benev/slate"
import {Input} from "./input.js"

export abstract class Device {
	onInput = pub<Input.Whatever>()
	abstract dispose: () => void
}

