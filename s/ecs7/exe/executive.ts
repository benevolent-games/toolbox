
import {System} from "./system.js"
import {Query} from "../core/query.js"
import {World} from "../core/world.js"
import {Behavior} from "./behavior.js"

export class Executive<Realm, Tick> {
	#realm: Realm
	#world: World<Realm>
	#mandates: [Behavior<Realm, Tick, any>, query: Query<any>][] = []

	constructor(
			realm: Realm,
			world: World<Realm>,
			system: System<Realm, Tick>,
		) {
		this.#world = world
		this.#realm = realm
		system.walk({
			behavior: b => this.#mandates.push([b, world.query(b.selector)]),
			responder: r => {
				const query = world.query(r.selector)
				const events = r.fn({world, realm})
				query.added(entity => events.added(entity.components, entity))
				query.removed(entity => events.removed(entity.components, entity))
			},
		})
	}

	execute(tick: Tick) {
		const world = this.#world
		const realm = this.#realm
		for (const [behavior, query] of this.#mandates) {
			const fn2 = behavior.fn({world, realm, tick})
			for (const [,entity] of query.matches)
				fn2(entity.components, entity)
		}
	}
}

