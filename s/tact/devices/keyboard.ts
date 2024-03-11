
import {Device} from "../parts/device.js"

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
				mods: {
					ctrl: event.ctrlKey,
					meta: event.metaKey,
					alt: event.altKey,
					shift: event.shiftKey,
				},
			})
		}

		const keydown = handler(true)
		const keyup = handler(false)

		target.addEventListener("keydown", keydown as any)
		target.addEventListener("keyup", keyup as any)

		this.dispose = () => {
			target.removeEventListener("keydown", keydown as any)
			target.removeEventListener("keyup", keyup as any)
		}
	}
}

