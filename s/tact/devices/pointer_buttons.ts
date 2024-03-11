
import {Device} from "../parts/device.js"

export class PointerButtons extends Device {
	static determine_mouse_button(event: MouseEvent) {
		switch (event.button) {
			case 0: return "LMB"
			case 1: return "MMB"
			case 2: return "RMB"
			default: return `MB${event.button + 1}`
		}
	}

	dispose: () => void

	constructor(target: EventTarget) {
		super()

		const handler = ({down}: {down: boolean}) => (event: PointerEvent) => {
			this.onInput.publish({
				event,
				down,
				kind: "button",
				code: PointerButtons.determine_mouse_button(event),
				repeat: false,
				mods: {
					ctrl: event.ctrlKey,
					meta: event.metaKey,
					alt: event.altKey,
					shift: event.shiftKey,
				},
			})
		}

		const pointerdown = handler({down: true})
		const pointerup = handler({down: false})

		target.addEventListener("pointerdown", pointerdown as any)
		target.addEventListener("pointerup", pointerup as any)

		this.dispose = () => {
			target.removeEventListener("keydown", pointerdown as any)
			target.removeEventListener("keyup", pointerup as any)
		}
	}
}

