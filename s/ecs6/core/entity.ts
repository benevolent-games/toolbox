
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

// const getClasses = Symbol()
// const attach = Symbol()
// const detach = Symbol()
// const call_deleted_on_all_hybrid_components = Symbol()

// export class Entity<Sel extends Selector = Selector> {
// 	static internal = {getClasses, attach, detach, call_deleted_on_all_hybrid_components} as const

// 	#components = new Map<CClass, CInstance>()
// 	#cache = new Map<string, [CClass, CInstance, boolean]>()
// 	#classes: CClass[] = []

// 	constructor(public readonly id: Id) {}

// 	has<Sel2 extends Selector>(selector: Sel2): this is Entity<Sel2 & Sel> {
// 		const classes = Object.values(selector)
// 		return classes.every(C => this.#components.has(C))
// 	}

// 	readonly components = new Proxy({}, {
// 		get: (_, ikey: string) => {
// 			const [,component, isHybrid] = this.#grab(ikey)
// 			if (isHybrid)
// 				return component
// 			else
// 				return component.state
// 		},
// 		set: (_, ikey: string, value: any) => {
// 			const [,component, isHybrid] = this.#grab(ikey)
// 			if (isHybrid)
// 				throw new Error(`cannot directly overwrite hybrid component "${ikey}"`)
// 			else
// 				component.state = value
// 			return true
// 		},
// 	}) as CHandle<Sel>

// 	#grab(ikey: string) {
// 		const result = this.#cache.get(ikey)
// 		if (!result) {
// 			console.error("cache", this.id, this.#cache)
// 			throw new Error(`failed to get component data for "${ikey}"`)
// 		}
// 		return result
// 	}

// 	[getClasses]() {
// 		return this.#classes
// 	}

// 	[attach](ikey: string, Component: CClass, component: CInstance) {
// 		this.#components.set(Component, component)
// 		this.#cache.set(ikey, [Component, component, component instanceof HybridComponent])
// 		this.#classes.push(Component)
// 	}

// 	[detach](ikey: string, Component: CClass) {
// 		const component = this.#components.get(Component)
// 		this.#components.delete(Component)
// 		this.#cache.delete(ikey)
// 		this.#classes = this.#classes.filter(C => C !== Component)
// 		if (component && component instanceof HybridComponent)
// 			component.deleted()
// 	}

// 	[call_deleted_on_all_hybrid_components]() {
// 		for (const [, component, isHybrid] of this.#cache.values())
// 			if (isHybrid)
// 				(component as any as HybridComponent<any, any>).deleted()
// 	}
// }

