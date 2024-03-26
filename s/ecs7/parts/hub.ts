
import {World} from "./world.js"
import {Logic} from "./logic.js"
import {Entity} from "./entity.js"
import {System} from "./system.js"
import {FnAlways, FnBehavior, FnResponder, Selector} from "./types.js"

export class Hub<Realm, Tick> {
	world = (realm: Realm) => new World<Realm>(realm)

	system = (name: string, children: Logic<Realm, Tick>[]) => (
		new System<Realm, Tick>(name, children)
	)

	always = (name: string) => ({
		logic: (fn: FnAlways<Realm, Tick>) => (
			new Logic<Realm, Tick>(name, ({realm, world}) =>
				tick => fn({realm, world, tick})
			)
		),
	})

	behavior = (name: string) => ({
		select: <Sel extends Selector>(selector: Sel) => ({
			logic: (fn: FnBehavior<Realm, Tick, Sel>) => (
				new Logic<Realm, Tick>(name, ({realm, world}) => {
					const query = world.query(selector)
					return tick => {
						for (const entity of query.matches)
							fn({realm, world, tick, entity})
					}
				})
			),
		}),
	})

	responder = (name: string) => ({
		select: <Sel extends Selector>(selector: Sel) => ({
			respond: (fn: FnResponder<Realm, Sel>) => (
				new Logic<Realm, Tick>(name, ({realm, world}) => {
					const query = world.query(selector)
					const map = new Map<Entity, () => void>()
					query.onAdded(entity => {
						const dispose = fn({realm, world, entity})
						map.set(entity, dispose)
					})
					query.onRemoved(entity => {
						const dispose = map.get(entity)
						if (dispose)
							dispose()
					})
					return () => {}
				})
			),
		}),
	})
}

