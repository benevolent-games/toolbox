
import {Id, Selector} from "./types.js"
import {Data} from "./data.js"
import {Entity} from "./entity.js"
import { Archetype } from "./archetype.js"

export class World<Realm> {
	#realm: Realm
	#data = new Data()

	constructor(realm: Realm) {
		this.#realm = realm
	}

	query = this.#data.query

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

