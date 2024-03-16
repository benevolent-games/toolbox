
import {Query} from "./query.js"
import {Entity} from "./entity.js"
import {CParams, Id, Selector} from "./types.js"
import {inherits} from "../../tools/inherits.js"
import {selectors_are_the_same} from "./utils.js"
import {id_counter} from "../../tools/id_counter.js"
import {HybridComponent} from "./hybrid_component.js"
import {uncapitalize} from "../../tools/uncapitalize.js"

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
				query[Query.internal.consider](entity)
		}
		return query
	}

	createEntity<Sel extends Selector>(selector: Sel, params: CParams<Sel>) {
		const id = this.#new_id()
		const entity = new Entity(id)
		this.#entities.set(id, entity)
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
				? (() => {
					const c = new Component(this.#realm, state) as HybridComponent<any, any>
					c.created()
					return c
				})()
				: new Component(state)
			entity[Entity.internal.attach](ikey, Component, component)
		}
		this.#reindex(entity)
		return entity as Entity<Sel1 & Sel2>
	}

	detachComponents<Sel1 extends Selector, Sel2 extends Selector>(entity: Entity<Sel1>, selector: Sel2) {
		for (const [key, Component] of Object.entries(selector)) {
			const ikey = uncapitalize(key) as keyof CParams<Selector>
			entity[Entity.internal.detach](ikey, Component)
		}
		this.#reindex(entity)
		return entity as Entity<Omit<Sel1, keyof Sel2>>
	}

	deleteEntity(id: Id) {
		const entity = this.#entities.get(id)!
		for (const query of this.#queries)
			if (entity.has(query.selector))
				query[Query.internal.remove](entity)
		this.#entities.delete(id)
		entity[Entity.internal.call_deleted_on_all_hybrid_components]()
	}

	getEntity<Sel extends Selector>(id: Id, selector: Sel) {
		const entity = this.#entities.get(id)! as Entity<Sel>

		if (!entity)
			throw new Error(`entity not found "${id}"`)

		if (!entity.has(selector))
			throw new Error(`entity did not match selector "${id}", {${Object.keys(selector).join(", ")}}`)

		return entity.components
	}

	#find_query<Sel extends Selector>(selector: Sel) {
		for (const query of this.#queries) {
			if (selectors_are_the_same(query.selector, selector))
				return query as Query<Sel>
		}
	}

	#reindex(entity: Entity) {
		for (const query of this.#queries)
			query[Query.internal.consider](entity)
	}
}

