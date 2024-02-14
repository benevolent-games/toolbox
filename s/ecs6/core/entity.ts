
import {HybridComponent} from "./hybrid_component.js"
import {CClass, CHandle, CInstance, Id, Selector} from "./types.js"

const getClasses = Symbol()
const attach = Symbol()
const detach = Symbol()
const call_deleted_on_all_hybrid_components = Symbol()

export class Entity<Sel extends Selector = Selector> {
	static internal = {getClasses, attach, detach, call_deleted_on_all_hybrid_components} as const

	#components = new Map<CClass, CInstance>()
	#cache = new Map<string, [CClass, CInstance, boolean]>()
	#classes: CClass[] = []

	constructor(public readonly id: Id) {}

	match(classes: CClass[]) {
		const attached = this[getClasses]()
		return classes.every(C => attached.includes(C))
	}

	readonly data = new Proxy({}, {
		get: (_, ikey: string) => {
			const [,component, isHybrid] = this.#grab(ikey)
			if (isHybrid)
				return component
			else
				return component.state
		},
		set: (_, ikey: string, value: any) => {
			const [,component, isHybrid] = this.#grab(ikey)
			if (isHybrid)
				throw new Error(`cannot directly overwrite hybrid component "${ikey}"`)
			else
				component.state = value
			return true
		},
	}) as CHandle<Sel>

	#grab(ikey: string) {
		const result = this.#cache.get(ikey)
		if (!result)
			throw new Error(`failed to get component data for "${ikey}"`)
		return result
	}

	[getClasses]() {
		return this.#classes
	}

	[attach](ikey: string, Component: CClass, component: CInstance) {
		this.#components.set(Component, component)
		this.#cache.set(ikey, [Component, component, component instanceof HybridComponent])
		this.#classes.push(Component)
	}

	[detach](ikey: string, Component: CClass) {
		const component = this.#components.get(Component)
		this.#components.delete(Component)
		this.#cache.delete(ikey)
		this.#classes = this.#classes.filter(C => C !== Component)
		if (component && component instanceof HybridComponent)
			component.deleted()
	}

	[call_deleted_on_all_hybrid_components]() {
		for (const [, component, isHybrid] of this.#cache.values())
			if (isHybrid)
				(component as any as HybridComponent<any, any>).deleted()
	}
}

