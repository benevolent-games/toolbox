
import {Device} from "../device.js"

export class Keyboard extends Device {
	dispose: () => void

	constructor(target: EventTarget) {
		super()

		const handler = ({down}: {down: boolean}) => (event: KeyboardEvent) => {
			event.preventDefault()
			this.onInput.publish({
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

		const keydown = handler({down: true})
		const keyup = handler({down: false})

		target.addEventListener("keydown", keydown as any)
		target.addEventListener("keyup", keyup as any)

		this.dispose = () => {
			target.removeEventListener("keydown", keydown as any)
			target.removeEventListener("keyup", keyup as any)
		}
	}
}

