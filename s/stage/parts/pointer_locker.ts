
export class PointerLocker {
	constructor(public element: HTMLElement) {
		element.addEventListener("click", () => this.lock())
	}

	get locked() {
		return !!document.pointerLockElement
	}

	lock() {
		if (!this.locked)
			this.element.requestPointerLock()
	}

	unlock() {
		if (this.locked)
			document.exitPointerLock()
	}

	onLockChange(fn: (locked: boolean) => {}) {
		const listener = () => fn(this.locked)
		window.addEventListener("pointerlockchange", listener)
		return () => window.removeEventListener("pointerlockchange", listener)
	}
}

