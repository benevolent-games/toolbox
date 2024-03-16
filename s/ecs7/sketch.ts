
/*

capabilities:
	- entities and components
	- querying entities by components
	- hybrid component lifecycles
	- ergonomic systems and behaviors

*/

import {Constructor} from "@benev/slate"
import {id_counter} from "../tools/id_counter.js"
import {uncapitalize} from "../tools/uncapitalize.js"

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
export type ComponentState<C extends Component> = C extends Component<infer State>
	? State
	: never

export type ComponentHandles<Sel extends Selector> = {
	[K in keyof Sel as K extends string ? Uncapitalize<K> : never]:
		InstanceType<Sel[K]> extends HybridComponent<any, any>
			? InstanceType<Sel[K]>
			: InstanceType<Sel[K]> extends Component<infer State>
				? State
				: never
}

export type ComponentStates<Sel extends Selector> = {
	[K in keyof Sel as K extends string ? Uncapitalize<K> : never]:
		InstanceType<Sel[K]> extends HybridComponent<any, infer State>
			? State
			: InstanceType<Sel[K]> extends Component<infer State>
				? State
				: never
}

//////////////////////////////////////////////////
//////////////////////////////////////////////////

export class Data {
	entities = new Map<Id, Map<Constructor<Component>, Serializable>>()

	getComponents(entityId: Id) {
		const components = this.entities.get(entityId)
		if (!components)
			throw new Error(`entity not found ${entityId}`)
		return components
	}
}

export class World {
	#data = new Data()

	createEntity<Sel extends Selector>(selector: Sel, states: ComponentStates<Sel>) {
	}
}

export class Entity<Sel extends Selector = Selector> {
	#data: Data
	#components: Map<Constructor<Component>, Serializable>

	constructor(data: Data, public readonly id: Id) {
		this.#data = data
		this.#components = data.getComponents(id)
	}

	/** check if this entity has the given components */
	has<Sel2 extends Selector>(selector: Sel2): this is Sel2 & Sel {
		const components = this.#components
		return Object.values(selector).every(c => components.has(c))
	}

	/** set a group of components */
	assign<Sel2 extends Selector>(selector: Sel2, states: ComponentStates<Sel2>): asserts this is Sel2 & Sel {
		const components = this.#components
		for (const [key, componentClass] of Object.entries(selector))
			components.set(componentClass, states[uncapitalize(key) as any])
	}

	/** remove a group of components */
	unassign<Sel2 extends Selector>(selector: Sel2): asserts this is Omit<Sel, keyof Sel2> {
		const components = this.#components
		for (const componentClass of Object.values(selector))
			components.delete(componentClass)
	}

	/** delete this entity */
	dispose() {
		this.#data.entities.delete(this.id)
	}
}

export abstract class Component<State extends Serializable = Serializable> {
	#componentClass: Constructor<Component>
	#components: Map<Constructor<Component>, Serializable>

	constructor(data: Data, componentClass: Constructor<Component>, entityId: Id) {
		this.#componentClass = componentClass
		this.#components = data.getComponents(entityId)
	}

	get state() {
		return this.#components.get(this.#componentClass) as State
	}

	set state(state: State) {
		this.#components.set(this.#componentClass, state)
	}
}

export abstract class HybridComponent<
		Realm,
		State extends Serializable,
	> extends Component<State> {

	constructor(public realm: Realm, ...params: ConstructorParameters<typeof Component>) {
		super(...params)
	}

	abstract created(): void
	abstract updated(): void
	abstract deleted(): void
}






// export type MetaComponent = {component: Component, state: Serializable}
// export type MetaEntity = {entity: Entity, components: Map<ComponentClass, MetaComponent>}
// export type EntityMap = Map<Id, MetaEntity>

// export class EntityAccess {
// 	metaEntity: MetaEntity
// 	constructor(
// 			public readonly entities: EntityMap,
// 			public readonly id: Id,
// 		) {
// 		const metaEntity = entities.get(id)
// 		if (!metaEntity)
// 			throw new Error(`entity not found ${id}`)
// 		this.metaEntity = metaEntity
// 	}
// 	deleteEntity() {
// 		this.entities.delete(this.metaEntity.entity.id)
// 	}
// 	setComponent(Component: ComponentClass, state: Serializable) {
// 		const {metaEntity} = this
// 		const c = metaEntity.components.get(Component)
// 		if (c)
// 			c.state = state
// 		else
// 			metaEntity.components.set(Component, {
// 				state,
// 				component: new Component(),
// 			})
// 	}
// 	deleteComponent(Component: ComponentClass) {
// 		this.metaEntity.components.delete(Component)
// 	}
// 	makeComponentAccess(Component: ComponentClass) {
// 		const metaComponent = this.metaEntity.components.get(Component)
// 		if (!metaComponent)
// 			throw new Error(`missing component`)
// 		return new ComponentAccess(metaComponent)
// 	}
// }

// export class ComponentAccess {
// 	constructor(public readonly metaComponent: MetaComponent) {}
// 	getState(): Serializable {
// 		return this.metaComponent.state
// 	}
// 	setState(state: Serializable) {
// 		return this.metaComponent.state = state
// 	}
// }

// export class World {
// 	#newId = id_counter()
// 	#entities: EntityMap = new Map()

// 	#makeEntityAccess(id: Id) {
// 		return new EntityAccess(this.#entities, id)
// 	}

// 	createEntity<Sel extends Selector = Selector>(selector: Sel, state: ComponentData<Sel>) {
// 		const id = this.#newId()
// 		const access = this.#makeEntityAccess(id)
// 		const entity = new Entity<Sel>(id, access)
// 		for (const [key, Component] of Object.entries(selector))
// 			access.setComponent(Component, state[uncapitalize(key) as any])
// 		return entity
// 	}

// 	getEntity<Sel extends Selector = Selector>(id: Id) {
// 		return this.#entities.get(id)?.entity
// 	}

// 	hasEntity(id: Id) {
// 		return this.#entities.has(id)
// 	}
// }

// /////////////////////////////////////////////
// /////////////////////////////////////////////

// export class Entity<Sel extends Selector = Selector> {
// 	#access: EntityAccess
// 	constructor(public readonly id: Id, access: EntityAccess) {
// 		this.#access = access
// 	}
// }

// export abstract class Component<State extends Serializable = Serializable> {
// 	#access: ComponentAccess

// 	constructor(access: ComponentAccess) {
// 		this.#access = access
// 	}

// 	get state() {
// 		return this.#access.getState() as State
// 	}

// 	set state(s: State) {
// 		this.#access.setState(s)
// 	}
// }

// export abstract class HybridComponent<
// 		Realm,
// 		State extends Serializable,
// 	> extends Component<State> {

// 	constructor(public realm: Realm, state: State) {
// 		super(state, () => this.updated())
// 	}

// 	abstract created(): void
// 	abstract updated(): void
// 	abstract deleted(): void
// }

