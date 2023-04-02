
import {Rec} from "./types.js"
import {make_id_getter} from "./utils/make_id_getter.js"

type EntityCallbacks<S extends Rec> = {
	on_add(id: number, state: Partial<S>): void
	on_delete(id: number, state: Partial<S>): void
}

export class Entities<S extends Rec> {
	#get_new_id = make_id_getter()
	#entities = new Map<number, Partial<S>>()
	#disposers = new Map<number, (es: Partial<S>) => void>()
	#callbacks: EntityCallbacks<S>

	constructor(callbacks: EntityCallbacks<S>) {
		this.#callbacks = callbacks
	}

	add<ES extends Partial<S>>(
			state: ES,
			dispose: (e: ES) => void = () => {},
		) {

		const id = this.#get_new_id()

		this.#entities.set(id, state)
		this.#disposers.set(id, dispose as any)

		this.#callbacks.on_add(id, state)
	}

	delete(id: number) {
		const state = this.#entities.get(id)!
		const dispose = this.#disposers.get(id)!

		if (!state || !dispose)
			throw new Error(`unknown entity "${id}"`)

		this.#callbacks.on_delete(id, state)
		this.#entities.delete(id)
		dispose(state)
	}

	;*select(selector: (keyof S)[]) {
		for (const entry of this.#entities) {
			const [, entity] = entry
			const matching = selector.every(s => entity.hasOwnProperty(s))

			if (matching)
				yield entry
		}
	}
}
