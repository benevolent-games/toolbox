
import {Constructor} from "@benev/slate"
import {Component} from "./component.js"
import {HybridComponent} from "./hybrid_component.js"

export type Id = number

export type Serializable = (
	| string
	| number
	| boolean
	| null
	| Serializable[]
	| {[key: string]: Serializable}
)

export type CInstance = Component<any>
export type CClass = Constructor<CInstance>
export type Selector = Record<string, CClass>
export type CState<C extends Component<any>> = C["state"]

export type CHandle<Sel extends Selector> = {
	[K in keyof Sel as K extends string ? Uncapitalize<K>: never]:
		InstanceType<Sel[K]> extends HybridComponent<any, any>
			? InstanceType<Sel[K]> // return the whole hybrid component instance, to do ugly advanced work
			: InstanceType<Sel[K]>["state"] // return only the state object, making for clean pure logic
}

export type CParams<Sel extends Selector> = {
	[K in keyof Sel as K extends string ? Uncapitalize<K> : never]:
		InstanceType<Sel[K]> extends HybridComponent<any, infer State>
			? State
			: ConstructorParameters<Sel[K]>[0]
}

