
export class Disposable {
	#disposers = new Set<() => void>()

	disposable(fn: () => void) {
		this.#disposers.add(fn)
	}

	dispose = () => {
		for (const dispose of this.#disposers)
			dispose()
	}
}

