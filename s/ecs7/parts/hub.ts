
import {World} from "./world.js"
import {Logic} from "./logic.js"
import {Entity} from "./entity.js"
import {System} from "./system.js"
import {HybridComponent} from "./hybrid-component.js"
import {FnAlways, FnBehavior, FnLogic, FnResponder, Selector, Serializable} from "./types.js"

export class Hub<Realm, Tick> {
	world = (realm: Realm) => new World<Realm>(realm)
	HybridComponent = <State extends Serializable>() => HybridComponent<Realm, State>

	system = (name: string, children: Logic<Realm, Tick>[]) => (
		new System<Realm, Tick>(name, children)
	)

	logic = (name: string, fn: FnLogic<Realm, Tick>) => (
		new Logic<Realm, Tick>(name, fn)
	)

	always = (name: string) => ({
		logic: (fn: FnAlways<Realm, Tick>) => (
			new Logic<Realm, Tick>(name, basis => {
				const fn2 = fn(basis)
				return tick => fn2(tick)
			})
		),
	})

	behavior = (name: string) => ({
		select: <Sel extends Selector>(selector: Sel) => ({
			logic: (fn: FnBehavior<Realm, Tick, Sel>) => (
				new Logic<Realm, Tick>(name, basis => {
					const query = basis.world.query(selector)
					const fn2 = fn(basis)
					return tick => {
						const fn3 = fn2(tick)
						for (const entity of query.matches)
							fn3(entity)
					}
				})
			),
		}),
	})

	responder = (name: string) => ({
		select: <Sel extends Selector>(selector: Sel) => ({
			respond: (fn: FnResponder<Realm, Sel>) => (
				new Logic<Realm, Tick>(name, basis => {
					const fn2 = fn(basis)
					const query = basis.world.query(selector)
					const map = new Map<Entity, () => void>()
					query.onAdded(entity => {
						const dispose = fn2(entity)
						map.set(entity, dispose)
					})
					query.onRemoved(entity => {
						const dispose = map.get(entity)
						if (dispose) {
							dispose()
							map.delete(entity)
						}
					})
					return () => {}
				})
			),
		}),
	})
}

