
import {System} from "./system.js"
import {World} from "../core/world.js"
import {Behavior} from "./behavior.js"
import {Responder} from "./responder.js"
import {Entity} from "../core/entity.js"
import {CHandle, Selector} from "../core/types.js"

export type Unit<Realm, Tick> = (
	| System<Realm, Tick>
	| Behavior<Realm, Tick, any>
	| Responder<Realm, any>
)

export type BehaviorFn<Realm, Tick, Sel extends Selector> = (
	({}: {world: World<Realm>, realm: Realm, tick: Tick}) =>
		(components: CHandle<Sel>, entity: Entity<Sel>) => void
)

export type ResponderFn<Realm, Sel extends Selector> = (
	({}: {world: World<Realm>, realm: Realm}) => {
		added: (components: CHandle<Sel>, entity: Entity<Sel>) => void
		removed: (components: CHandle<Sel>, entity: Entity<Sel>) => void
	}
)

