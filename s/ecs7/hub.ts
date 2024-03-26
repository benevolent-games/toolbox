
import {World} from "./core/classes/world.js"
import {System} from "./exe/system.js"
import {Selector} from "./core/types.js"
import {Behavior} from "./exe/behavior.js"
import {Executive} from "./exe/executive.js"
import {Responder} from "./exe/responder.js"
import {BehaviorFn, ResponderFn, Unit} from "./exe/types.js"

export * from "./core/types.js"
export * from "./core/utils.js"

export * from "./core/classes/component.js"
export * from "./core/classes/entity.js"
export * from "./core/classes/hybrid-component.js"
export * from "./core/classes/query.js"
export * from "./core/classes/world.js"

export * from "./exe/executive.js"

export class Hub<Realm, Tick> {
	world = (realm: Realm) => new World<Realm>(realm)

	system = (name: string, children: Unit<Realm, Tick>[]) => (
		new System<Realm, Tick>(name, children)
	)

	behavior = (name: string) => ({
		select: <Sel extends Selector>(selector: Sel) => ({
			act: (fn: BehaviorFn<Realm, Tick, Sel>) => (
				new Behavior<Realm, Tick, Sel>(name, selector, fn)
			),
		}),
	})

	responder = (name: string) => ({
		select: <Sel extends Selector>(selector: Sel) => ({
			respond: (fn: ResponderFn<Realm, Sel>) => new Responder(name, selector, fn),
		}),
	})

	executive = (realm: Realm, world: World<Realm>, system: System<Realm, Tick>) => (
		new Executive<Realm, Tick>(realm, world, system)
	)

	archetype = <P extends any[], X>(
		fn: (world: World<Realm>) => (...p: P) => X
	) => fn
}

