
import {Constructor} from "@benev/slate"

import {World} from "./world.js"
import {Entity} from "./entity.js"
import {Component} from "./component.js"
import {HybridComponent} from "./hybrid-component.js"

export type Id = number

export type Serializable = (
	| string
	| number
	| boolean
	| null
	| Serializable[]
	| {[key: string]: Serializable}
)

export type Selector = Record<string, Constructor<Component>>

export type Access<Sel extends Selector> = {
	[K in keyof Sel as K extends string ? Uncapitalize<K> : never]:
		InstanceType<Sel[K]> extends HybridComponent<any, any>

			// return the whole hybrid component instance, to do ugly advanced work
			? InstanceType<Sel[K]>

			// return only the state object, making for clean pure logic
			: InstanceType<Sel[K]>["state"]
}

export type State<Sel extends Selector> = {
	[K in keyof Sel as K extends string ? Uncapitalize<K> : never]:
		InstanceType<Sel[K]> extends HybridComponent<any, infer State>
			? State
			: InstanceType<Sel[K]> extends Component<infer State>
				? State
				: never
}

export type FnLogic<Realm, Tick> = ({}: {
	realm: Realm
	world: World<Realm>,
}) => (tick: Tick) => void

export type FnAlways<Realm, Tick> = ({}: {
	realm: Realm
	world: World<Realm>
	tick: Tick
}) => void

export type FnBehavior<Realm, Tick, Sel extends Selector> = ({}: {
	realm: Realm
	world: World<Realm>
	tick: Tick
	entity: Entity<Sel>
}) => void

export type FnResponder<Realm, Sel extends Selector> = ({}: {
	realm: Realm
	world: World<Realm>
	entity: Entity<Sel>
}) => () => void

