
import {Id} from "../types.js"
import {Data} from "./data.js"
import {Entity} from "./entity.js"

export class World<Realm> {
	#realm: Realm
	#data = new Data()

	constructor(realm: Realm) {
		this.#realm = realm
	}

	query = this.#data.query

	createEntity() {
		const data = this.#data
		const id = data.newId()
		const entity = new Entity<{}>(this.#realm, id, data)
		data.insertEntity(id, entity)
		return entity
	}

	getEntity(id: Id) {
		return this.#data.getEntity(id)
	}
}

