
import {ev} from "@benev/slate"

export class PointerLocker {
	static make = (element: HTMLElement) => new this(element)

	constructor(public element: HTMLElement) {}

	get locked() {
		return !!document.pointerLockElement
	}

	lock() {
		if (!this.locked)
			(this.element.requestPointerLock as any)({unadjustedMovement: true})
	}

	unlock() {
		if (this.locked)
			document.exitPointerLock()
	}

	toggle() {
		if (this.locked)
			this.unlock()
		else
			this.lock()
	}

	onLockChange(fn: (locked: boolean) => void) {
		const listener = () => fn(this.locked)
		return ev(document, {
			pointerlockchange: listener,
			pointerlockerror: listener,
		})
	}
}

