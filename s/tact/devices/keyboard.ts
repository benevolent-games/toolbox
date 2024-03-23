
import {mods} from "./utils/mods.js"
import {Device} from "../parts/device.js"
import {zevents} from "../../tools/zevents.js"

export class Keyboard extends Device {
	dispose: () => void

	constructor(target: EventTarget) {
		super()

		const handler = (down: boolean) => (event: KeyboardEvent) => {
			this.onInput.publish({
				event,
				down,
				kind: "button",
				code: event.code,
				repeat: event.repeat,
				mods: mods(event),
			})
		}

		this.dispose = zevents(target, {
			keydown: handler(true),
			keyup: handler(false),
		})
	}
}

