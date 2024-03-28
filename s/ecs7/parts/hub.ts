
import {World} from "./world.js"
import {Logic} from "./logic.js"
import {Entity} from "./entity.js"
import {System} from "./system.js"
import {FnBehavior, FnLogic, FnResponder, FnSystem, Selector} from "./types.js"

export class Hub<Realm, Tick> {
	world = (realm: Realm) => new World<Realm>(realm)

	system = (name: string, fn: FnSystem<Realm, Tick>) => (
		new System<Realm, Tick>(name, fn)
	)

	logic = (name: string, fn: FnLogic<Realm, Tick>) => (
		new Logic<Realm, Tick>(name, fn)
	)

	behavior = (name: string) => ({
		select: <Sel extends Selector>(selector: Sel) => ({
			logic: (fn: FnBehavior<Tick, Sel>) => (
				new Logic<Realm, Tick>(name, basis => {
					const query = basis.world.query(selector)
					return tick => {
						const fn2 = fn(tick)
						for (const entity of query.matches)
							fn2(entity)
					}
				})
			),
		}),
	})

	responder = (name: string) => ({
		select: <Sel extends Selector>(selector: Sel) => ({
			respond: (fn: FnResponder<Sel>) => (
				new Logic<Realm, Tick>(name, basis => {
					const query = basis.world.query(selector)
					const map = new Map<Entity, () => void>()

					query.onAdded(entity => {
						const dispose = fn(entity)
						if (dispose)
							map.set(entity, dispose)
					})

					query.onRemoved(entity => {
						const dispose = map.get(entity)
						if (dispose) {
							dispose()
							map.delete(entity)
						}
					})
				})
			),
		}),
	})
}

