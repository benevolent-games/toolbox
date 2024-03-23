
import {Input} from "../tact.js"
import {mods} from "./utils/mods.js"
import {Device} from "../parts/device.js"
import {zevents} from "../../tools/zevents.js"

export class MouseButtons extends Device {

	static determine_mouse_button_code(event: MouseEvent): Input.MouseCode {
		switch (event.button) {
			case 0: return "MousePrimary"
			case 1: return "MouseTertiary"
			case 2: return "MouseSecondary"
			default: return `Mouse${event.button + 1}` as Input.MouseCode
		}
	}

	static determine_mouse_wheel_code(event: WheelEvent) {
		return event.deltaY > 0
			? "MouseWheelDown"
			: "MouseWheelUp"
	}

	dispose: () => void

	#is_repeating = (() => {
		const held = new Set<string>()
		return (down: boolean, code: string) => {
			const repeat = down && held.has(code)
			if (down) held.add(code)
			else held.delete(code)
			return repeat
		}
	})()

	constructor(target: EventTarget) {
		super()

		const mousey = (down: boolean) => (event: MouseEvent) => {
			const code = MouseButtons.determine_mouse_button_code(event)
			const repeat = this.#is_repeating(down, code)
			this.onInput.publish({
				event,
				down,
				code,
				repeat,
				kind: "button",
				mods: mods(event),
			})
		}

		this.dispose = zevents(target, {
			mouseup: mousey(false),
			mousedown: mousey(true),
			wheel: (event: WheelEvent) => {
				this.onInput.publish({
					event,
					down: true,
					repeat: false,
					kind: "button",
					mods: mods(event),
					code: MouseButtons.determine_mouse_wheel_code(event),
				})
			},
		})
	}
}

