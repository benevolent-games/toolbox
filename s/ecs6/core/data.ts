
import {Query} from "./query.js"
import {Entity} from "./entity.js"
import {Id, Selector} from "./types.js"
import {selectors_are_the_same} from "./utils.js"
import {id_counter} from "../../tools/id_counter.js"

export class Data {
	newId = id_counter()
	queries = new Set<Query>()
	entities = new Map<Id, Entity>()

	getEntity(id: Id) {
		const entity = this.entities.get(id)
		if (!entity)
			throw new Error(`entity not found ${id}`)
		return entity
	}

	find_query<Sel extends Selector>(selector: Sel) {
		for (const query of this.queries) {
			if (selectors_are_the_same(query.selector, selector))
				return query as Query<Sel>
		}
	}

	reindex(entity: Entity) {
		for (const query of this.queries)
			query[Query.internal.consider](entity)
	}
}

