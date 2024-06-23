
import {Input} from "../types/input.js"
import {Device} from "../parts/device.js"

const noMods: Input.Modifiers = Object.freeze({
	alt: false,
	ctrl: false,
	meta: false,
	shift: false,
})

export class Virtual<Codes extends string> extends Device {
	dispose = () => {}

	actuate = (code: Codes, down: boolean, repeat = false) => {
		this.onInput.publish({
			down,
			repeat,
			event: null,
			mods: noMods,
			kind: "button",
			code: code as string,
		})
	}
}

