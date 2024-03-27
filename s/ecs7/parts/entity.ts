
import {Constructor} from "@benev/slate"

import {Data} from "./data.js"
import {Id} from "../../tools/id.js"
import {Archetype} from "./archetype.js"
import {Component} from "./component.js"
import {Access, Selector} from "./types.js"
import {inherits} from "../../tools/inherits.js"
import {HybridComponent} from "./hybrid-component.js"
import {uncapitalize} from "../../tools/uncapitalize.js"

export class Entity<Sel extends Selector = Selector> {
	#realm: any
	#data: Data
	#componentsByName = new Map<string, Component>
	#componentsByConstructor = new Map<Constructor<Component>, Component>()

	constructor(realm: any, public readonly id: Id, data: Data) {
		this.#realm = realm
		this.#data = data
	}

	/** check if this entity has the given components */
	has<Sel2 extends Selector>(selector: Sel2): this is Entity<Sel2 & Sel> {
		const components = this.#componentsByConstructor
		return Object.values(selector).every(c => components.has(c))
	}

	/** add/update a group of components */
	assign<Sel2 extends Selector>(archetype: Archetype<Sel2>) {
		const data = this.#data
		for (const [key, constructor] of Object.entries(archetype.selector)) {
			const name = uncapitalize(key) as any
			const state = archetype.state[name]
			let component = this.#componentsByConstructor.get(constructor)
			if (component) {
				component.state = state
			}
			else {
				if (inherits(constructor, HybridComponent)) {
					const hybrid = new constructor(
						this.#realm,
						this.id,
						state,
					) as HybridComponent<any, any>
					hybrid.created()
					component = hybrid
				}
				else {
					component = new constructor(this.id, state)
				}
				this.#componentsByName.set(name, component)
				this.#componentsByConstructor.set(constructor, component)
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
	}) as Access<Sel>

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

