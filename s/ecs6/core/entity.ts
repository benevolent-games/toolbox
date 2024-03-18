
import {Constructor} from "@benev/slate"

import {Data} from "./data.js"
import {Component} from "./component.js"
import {CParams, Id, Selector} from "./types.js"
import {HybridComponent} from "./hybrid_component.js"
import {uncapitalize} from "../../tools/uncapitalize.js"

export class Entity<Sel extends Selector = Selector> {
	#data: Data
	#componentsByName = new Map<string, Component>
	#componentsByConstructor = new Map<Constructor<Component>, Component>()

	constructor(public readonly id: Id, data: Data) {
		this.#data = data
	}

	/** check if this entity has the given components */
	has<Sel2 extends Selector>(selector: Sel2): this is Entity<Sel2 & Sel> {
		const components = this.#componentsByConstructor
		return Object.values(selector).every(c => components.has(c))
	}

	/** add/update a group of components */
	assign<Sel2 extends Selector>(selector: Sel, states: CParams<Sel2>) {
		const data = this.#data
		for (const [key, constructor] of Object.entries(selector)) {
			const name = uncapitalize(key) as any
			const state = states[name]
			const component = this.#componentsByConstructor.get(constructor)
			if (component) {
				component.state = state
			}
			else {
				const id = data.newId()
				const component = new constructor(id)
				this.#componentsByName.set(name, component)
				this.#componentsByConstructor.set(constructor, component)
				if (component instanceof HybridComponent)
					component.created()
			}
		}
		data.reindex(this)
		return this as unknown as Entity<Sel2 & Sel>
	}

	/** remove a group of components */
	unassign<Sel2 extends Selector>(selector: Sel2) {
		for (const [key, constructor] of Object.entries(selector)) {
			this.#destroyComponent(constructor)
			this.#componentsByName.delete(uncapitalize(key))
		}
		this.#data.reindex(this)
		return this as unknown as Entity<Omit<Sel, keyof Sel2>>
	}

	#grab(name: string) {
		const component = this.#componentsByName.get(name)
		if (!component)
			throw new Error(`component not found ${name}`)
		return component
	}

	/**
	 * access the components attached to this entity.
	 *  - for ordinary components, this returns the component's state
	 *  - for hybrid components, this returns the whole hybrid component, so you could call its methods etc.
	 */
	readonly components = new Proxy({}, {
		get: (_, name: string) => {
			const component = this.#grab(name)
			return (component instanceof HybridComponent)
				? component
				: component.state
		},
		set: (_, name: string, value: any) => {
			const component = this.#grab(name)
			if (component instanceof HybridComponent)
				throw new Error(`cannot directly overwrite hybrid component "${name}"`)
			else
				component.state = value
			return true
		},
	})

	/** delete and remove this entity, and all its components */
	dispose() {
		for (const constructor of this.#componentsByConstructor.keys())
			this.#destroyComponent(constructor)
		this.#data.removeEntity(this.id)
	}

	#destroyComponent(constructor: Constructor<Component>) {
		const components = this.#componentsByConstructor
		const component = components.get(constructor)
		if (component) {
			if (component instanceof HybridComponent)
				component.deleted()
			components.delete(constructor)
		}
	}
}

