
import {Constructor} from "@benev/slate"
import {pubb} from "../tools/pubb.js"
import {inherits} from "../tools/inherits.js"
import {id_counter} from "../tools/id_counter.js"
import {uncapitalize} from "../tools/uncapitalize.js"

const internal = Symbol()

export type Id = number

export type Serializable = (
	| string
	| number
	| boolean
	| null
	| Serializable[]
	| {[key: string]: Serializable}
)

export type CInstance = Component<any>
export type CClass = Constructor<CInstance>
export type Selector = Record<string, CClass>

export type CHandle<Sel extends Selector> = {
	[K in keyof Sel as K extends string ? Uncapitalize<K>: never]:
		InstanceType<Sel[K]> extends HybridComponent<any, any>
			? InstanceType<Sel[K]> // return the whole hybrid component instance, to do ugly advanced work
			: InstanceType<Sel[K]>["state"] // return only the state object, making for clean pure logic
}

export type CParams<Sel extends Selector> = {
	[K in keyof Sel as K extends string ? Uncapitalize<K> : never]:
		InstanceType<Sel[K]> extends HybridComponent<any, infer State>
			? State
			: ConstructorParameters<Sel[K]>[0]
}

export function selectors_are_the_same(alpha: Selector, bravo: Selector) {
	const a = Object.values(alpha)
	const b = Object.values(bravo)
	return a.length === b.length
		? a.every(C => b.includes(C))
		: false
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export abstract class Component<State extends Serializable> {
	constructor(public state: State) {}
}

export abstract class HybridComponent<
		Realm,
		State extends Serializable,
	> extends Component<State> {
	constructor(public realm: Realm, state: State) {
		super(state)
		this.init()
	}
	abstract init(): void
	abstract deleted(): void
}

export class Entity<Sel extends Selector = Selector> {
	#components = new Map<CClass, CInstance>()
	#cache = new Map<string, [CClass, CInstance, boolean]>()
	#classes: CClass[] = []

	constructor(public readonly id: Id) {}

	match(classes: CClass[]) {
		const attached = this[internal].getClasses()
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

	[internal] = {
		getClasses: () => {
			return this.#classes
		},

		attach: (ikey: string, Component: CClass, component: CInstance) => {
			this.#components.set(Component, component)
			this.#cache.set(ikey, [Component, component, component instanceof HybridComponent])
			this.#classes.push(Component)
		},

		detach: (ikey: string, Component: CClass) => {
			const component = this.#components.get(Component)
			this.#components.delete(Component)
			this.#cache.delete(ikey)
			this.#classes = this.#classes.filter(C => C !== Component)
			if (component && component instanceof HybridComponent)
				component.deleted()
		},

		call_deleted_on_all_hybrid_components: () => {
			for (const [, component, isHybrid] of this.#cache.values())
				if (isHybrid)
					(component as HybridComponent<any, any>).deleted()
		},
	}

	#grab(ikey: string) {
		const result = this.#cache.get(ikey)
		if (!result)
			throw new Error(`failed to get component data for "${ikey}"`)
		return result
	}
}

export class Query<Sel extends Selector = Selector> {
	#classes: CClass[] = []

	#matches = new Map<Id, CHandle<Sel>>()
	readonly added = pubb<[CHandle<Sel>, Id]>()
	readonly removed = pubb<[CHandle<Sel>, Id]>()

	constructor(public readonly selector: Sel) {
		this.#classes = Object.values(selector)
	}

	[internal] = {
		consider: (entity: Entity) => {
			if (entity.match(this.#classes)) {
				if (!this.#matches.has(entity.id))
					this[internal].add(entity)
			}
			else
				this[internal].remove(entity)
		},

		add: (entity: Entity<any>) => {
			this.#matches.set(entity.id, entity.data)
			this.added.publish(entity.data, entity.id)
		},

		remove: (entity: Entity<any>) => {
			this.#matches.delete(entity.id)
			this.removed.publish(entity.data, entity.id)
		}
	}
}

export class World<Realm> {
	#realm: Realm
	#new_id = id_counter()
	#queries = new Set<Query>()
	#entities = new Map<Id, Entity>()

	constructor(realm: Realm) {
		this.#realm = realm
	}

	query<Sel extends Selector>(selector: Sel) {
		let query = this.#find_query(selector)
		if (!query) {
			query = new Query(selector)
			this.#queries.add(query)
			for (const entity of this.#entities.values())
				query[internal].consider(entity)
		}
		return query
	}

	createEntity<Sel extends Selector>(selector: Sel, params: CParams<Sel>) {
		const id = this.#new_id()
		const entity = new Entity(id)
		for (const query of this.#queries)
			query[internal].consider(entity)
		return this.attachComponents(entity, selector, params)
	}

	attachComponents<Sel1 extends Selector, Sel2 extends Selector>(
			entity: Entity<Sel1>,
			selector: Sel2,
			params: CParams<Sel2>,
		) {
		for (const [key, Component] of Object.entries(selector)) {
			const ikey = uncapitalize(key) as keyof CParams<Selector>
			const state = params[ikey]
			const component = inherits(Component, HybridComponent)
				? new Component(this.#realm, state)
				: new Component(state)
			entity[internal].attach(ikey, Component, component)
		}
		this.#reindex(entity)
		return entity as Entity<Sel1 & Sel2>
	}

	detachComponents<Sel1 extends Selector, Sel2 extends Selector>(entity: Entity<Sel1>, selector: Sel2) {
		for (const [key, Component] of Object.entries(selector)) {
			const ikey = uncapitalize(key) as keyof CParams<Selector>
			entity[internal].detach(ikey, Component)
		}
		this.#reindex(entity)
		return entity as Entity<Omit<Sel1, keyof Sel2>>
	}

	deleteEntity(id: Id) {
		const entity = this.#entities.get(id)!
		for (const query of this.#queries)
			query[internal].remove(entity)
		this.#entities.delete(id)
		entity[internal].call_deleted_on_all_hybrid_components()
	}

	getEntity<Sel extends Selector>(id: Id, selector: Sel) {
		const entity = this.#entities.get(id)! as Entity<Sel>

		if (!entity)
			throw new Error(`entity not found "${id}"`)

		if (!entity.match(Object.values(selector)))
			throw new Error(`entity did not match selector "${id}", {${Object.keys(selector).join(", ")}}`)

		return entity.data
	}

	#find_query<Sel extends Selector>(selector: Sel) {
		for (const query of this.#queries) {
			if (selectors_are_the_same(query.selector, selector))
				return query as Query<Sel>
		}
	}

	#reindex(entity: Entity) {
		for (const query of this.#queries)
			query[internal].consider(entity)
	}
}

























































