
import {EntityCallbacks, Rec} from "./types.js"
import {make_id_getter} from "./utils/make_id_getter.js"

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
		return id
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

	get(id: number) {
		const entity = this.#entities.get(id)

		if (!entity)
			throw new Error(`unknown entity id ${id}`)

		return entity
	}
}
