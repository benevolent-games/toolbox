
/*

capabilities:
	- entities and components
	- querying entities by components
	- hybrid component lifecycles
	- ergonomic systems and behaviors

*/

import {Constructor, maptool} from "@benev/slate"
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

export type EntitySelector<E extends Entity> = E extends Entity<infer Selector>
	? Selector
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

// export type ComponentEntry = {
// 	id: Id
// 	name: string
// 	state: Serializable
// 	constructor: Constructor<Component>
// }

// export class ComponentIndex {
// 	entries = new Set<ComponentEntry>()
// 	byId = new Map<Id, ComponentEntry>()
// 	byName = new Map<string, ComponentEntry>()
// 	byConstructor = new Map<Constructor<Component>, ComponentEntry>()

// 	instances = new Map<Id, Component>()

// 	add(entry: ComponentEntry, instance: Component) {
// 		this.entries.add(entry)
// 		this.byId.set(entry.id, entry)
// 		this.byName.set(entry.name, entry)
// 		this.byConstructor.set(entry.constructor, entry)
// 		this.instances.set(entry.id, instance)
// 	}

// 	delete(entry: ComponentEntry) {
// 		this.entries.delete(entry)
// 		this.byId.delete(entry.id)
// 		this.byName.delete(entry.name)
// 		this.byConstructor.delete(entry.constructor)
// 		this.instances.delete(entry.id)
// 	}
// }

export class Data {
	newId = id_counter()

	entities = new Map<Id, ComponentIndex>()

	guaranteeComponentIndex(entityId: Id) {
		return maptool(this.entities)
			.guarantee(entityId, () => new ComponentIndex())
	}
}

export class World {
	#data = new Data()

	createEntity<Sel extends Selector>(selector: Sel, states: ComponentStates<Sel>): Entity<Sel> {
		const entity: Entity = new Entity(this.#data, this.#data.newId())
		return entity.assign(selector, states)
	}
}

function assignComponents<Sel extends Selector, Sel2 extends Selector>(entity: Entity<Sel>, selector: Sel2, states: ComponentStates<Sel2>): asserts entity is Entity<Sel2 & Sel> {
	entity.assign(selector, states)
}

function unassignComponents<Sel extends Selector, Sel2 extends Selector>(entity: Entity<Sel>, selector: Sel2): asserts entity is Entity<{[K in keyof Sel2]: never} & Sel> {
	entity.unassign(selector)
}

/** an entity is a view of a set of components */
export class Entity<Sel extends Selector = Selector> {
	static assign: typeof assignComponents = assignComponents
	static unassign: typeof unassignComponents = unassignComponents

	#data: Data
	#index: ComponentIndex

	constructor(data: Data, public readonly id: Id) {
		this.#data = data
		this.#index = data.guaranteeComponentIndex(id)
	}

	/** check if this entity has the given components */
	has<Sel2 extends Selector>(selector: Sel2): this is Entity<Sel2 & Sel> {
		const index = this.#index
		return Object.values(selector).every(c => index.byConstructor.has(c))
	}

	/** set a group of components */
	assign<Sel2 extends Selector>(selector: Sel2, states: ComponentStates<Sel2>) {
		const data = this.#data
		const index = this.#index
		for (const [key, constructor] of Object.entries(selector)) {
			const name = uncapitalize(key) as any
			const state = states[name]

			// const entry = index.byConstructor.get(constructor)
			// if (entry)
			// 	entry.state = state
			// else {
			// 	const id = data.newId()
			// 	index.add({
			// 		id,
			// 		name,
			// 		state,
			// 		constructor,
			// 	})
			// }
		}
		return this as unknown as Entity<Sel2 & Sel>
	}

	/** remove a group of components */
	unassign<Sel2 extends Selector>(selector: Sel2) {
		const index = this.#index
		for (const constructor of Object.values(selector)) {
			const entry = index.byConstructor.get(constructor)
			if (entry)
				index.delete(entry)
		}
		return this as unknown as Entity<Omit<Sel, keyof Sel2>>
	}

	readonly components = {} as ComponentHandles<Sel>

	// readonly components = new Proxy({}, {
	// 	get: (_, ikey: string) => {
	// 		const [,component, isHybrid] = this.#grab(ikey)
	// 		if (isHybrid)
	// 			return component
	// 		else
	// 			return component.state
	// 	},
	// 	set: (_, ikey: string, value: any) => {
	// 		const [,component, isHybrid] = this.#grab(ikey)
	// 		if (isHybrid)
	// 			throw new Error(`cannot directly overwrite hybrid component "${ikey}"`)
	// 		else
	// 			component.state = value
	// 		return true
	// 	},

	// }) as ComponentHandles<Sel>

	/** delete this entity */
	dispose() {
		this.#data.entities.delete(this.id)
	}
}

export abstract class Component<State extends Serializable = Serializable> {
	#componentClass: Constructor<Component>
	#entry: ComponentEntry

	constructor(data: Data, componentClass: Constructor<Component>, entityId: Id) {
		this.#componentClass = componentClass
		this.#entry = data.guaranteeComponentIndex(entityId)
	}

	get state() {
		return this.#entry.get(this.#componentClass) as State
	}

	set state(state: State) {
		this.#entry.set(this.#componentClass, state)
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


//////////////////////

class Lol extends Component<number> {}
class Lmao extends Component<string> {}
class Rofl extends Component<{}> {}

const selector = {Lol}
const states = {lol: 123}

const world = new World()

const entity = world.createEntity(selector, states)
entity.selector.Lol

assignComponents(entity, {Lmao}, {lmao: "lmao"})
entity.selector.Lol
entity.selector.Lmao

Entity.unassign(entity, {Lol})
entity.selector.Lol
entity.states.lol
entity.states.lmao



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

