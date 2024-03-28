
import {Data} from "./data.js"
import {Entity} from "./entity.js"
import {Selector} from "./types.js"
import {Id} from "../../tools/id.js"
import {Archetype} from "./archetype.js"

export class World<Realm> {
	#realm: Realm
	#data = new Data()

	constructor(realm: Realm) {
		this.#realm = realm
	}

	query = this.#data.query

	obtain(ids: Id[]) {
		const requested = new Set(ids)
		const matches: Entity[] = []
		const goal = ids.length
		for (const entity of this.#data.allEntities) {
			if (requested.has(entity.id))
				matches.push(entity)
			if (matches.length >= goal)
				return matches
		}
		return matches
	}

	createEntity<Sel extends Selector>(archetype: Archetype<Sel>) {
		const data = this.#data
		const id = data.newId()
		const entity = new Entity(this.#realm, id, data)
		data.insertEntity(id, entity)
		return entity.assign(archetype) as Entity<Sel>
	}

	getEntity(id: Id) {
		return this.#data.getEntity(id)
	}
}

