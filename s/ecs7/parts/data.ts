
import {Query} from "./query.js"
import {Entity} from "./entity.js"
import {Selector} from "./types.js"
import {Id, id_counter} from "../../tools/id.js"
import {selectors_are_the_same} from "./utils.js"

export class Data {
	newId = id_counter()
	#queries = new Set<Query>()
	#entities = new Map<Id, Entity>()

	get allEntities() {
		return this.#entities.values()
	}

	maybeEntity(id: Id) {
		return this.#entities.get(id)
	}

	getEntity(id: Id) {
		const entity = this.#entities.get(id)
		if (!entity)
			throw new Error(`entity not found ${id}`)
		return entity
	}

	insertEntity(id: Id, entity: Entity) {
		this.#entities.set(id, entity)
		this.reindex(entity)
	}

	removeEntity(id: Id) {
		const entity = this.#entities.get(id)
		if (entity) {
			this.#entities.delete(id)
			for (const query of this.#queries) {
				query.remove(entity)
			}
		}
	}

	query = <Sel extends Selector>(selector: Sel) => {
		let query = this.#find_query(selector)
		if (!query) {
			query = new Query(selector)
			this.#queries.add(query)
			for (const entity of this.#entities.values())
				query.consider(entity)
		}
		return query
	}

	reindex(entity: Entity) {
		for (const query of this.#queries)
			query.consider(entity)
	}

	#find_query<Sel extends Selector>(selector: Sel) {
		for (const query of this.#queries)
			if (selectors_are_the_same(query.selector, selector))
				return query as Query<Sel>
	}
}

