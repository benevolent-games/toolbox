
import {Constructor} from "@benev/slate"
import {id_counter} from "../tools/id_counter.js"

// import {Vec3} from "../math/vec3.js"
// import {Quat} from "../math/quat.js"
// import {Scene} from "@babylonjs/core/scene.js"
// import {babylonian} from "../math/babylonian.js"
// import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"

function inherits(targetClass: Function, baseClass: Function): boolean {
	let proto = Object.getPrototypeOf(targetClass.prototype)
	while (proto != null) {
		if (proto === baseClass.prototype)
			return true
		proto = Object.getPrototypeOf(proto);
	}
	return false
}

////////
//////// TYPES
////////

export type Id = number

export type Serializable = (
	| string
	| number
	| boolean
	| null
	| Serializable[]
	| {[key: string]: Serializable}
)

export type ComponentInstance = Component<any>
export type ComponentClass = Constructor<ComponentInstance>
export type Selector = Record<string, ComponentClass>
export type Entry<Realm> = [Id, Entity<Realm>]

export type Resolve<Sel extends Selector> = {
	[K in keyof Sel as K extends string ? Uncapitalize<K>: never]:
		InstanceType<Sel[K]> extends HybridComponent<any, any>
			? InstanceType<Sel[K]> // return the whole hybrid component instance, to do ugly advanced work
			: InstanceType<Sel[K]>["state"] // return only the state object, making for clean pure logic
}

// export type ComponentSpec<C extends ComponentClass = ComponentClass> = [
// 	ComponentClass,
// 	C extends Constructor<HybridComponent<any, infer State>>
// 		? State
// 		: ConstructorParameters<C>[0],
// ]

export type ComponentParams<Sel extends Selector> = {
	[K in keyof Sel as K extends string ? Uncapitalize<K> : never]:
		InstanceType<Sel[K]> extends HybridComponent<any, infer State>
			? State
			: ConstructorParameters<Sel[K]>[0]
}

////////
//////// FUNDAMENTALS
////////

function uncapitalize(s: string) {
	if (s.length) {
		const [c] = s
		const rest = s.slice(1)
		return c.toLowerCase() + rest
	}
	return s
}

export abstract class Component<State extends Serializable> {
	constructor(public state: State) {}
}

export abstract class HybridComponent<
		Realm,
		State extends Serializable,
	> extends Component<State> {
	constructor(public realm: Realm, state: State) {
		super(state)
		this.init()
	}
	abstract init(): void
	abstract deleted(): void
}

export class Entity<Realm, Sel extends Selector = Selector> {
	static create<Realm, Sel extends Selector>(realm: Realm, selector: Sel, params: ComponentParams<Sel>) {
		const entity = new this<Realm, Sel>(realm)
		entity.createComponents(selector, params)
		return entity
	}

	#realm: Realm
	constructor(realm: Realm) {
		this.#realm = realm
	}

	#components = new Map<ComponentClass, ComponentInstance>()
	#cache = new Map<string, [ComponentClass, ComponentInstance, boolean]>
	#classes: ComponentClass[] = []

	get classes() {
		return this.#classes
	}

	match(classes: ComponentClass[]) {
		const entityTypes = this.classes
		return classes.every(C => entityTypes.includes(C))
	}

	createComponents(selector: Sel, params: ComponentParams<Sel>) {
		for (const [key, Component] of Object.entries(selector)) {
			const ikey = uncapitalize(key) as keyof ComponentParams<Selector>
			const state = params[ikey]
			const component = inherits(Component, HybridComponent)
				? new Component(this.#realm, state)
				: new Component(state)
			this.#components.set(Component, component)
			this.#cache.set(ikey, [Component, component, component instanceof HybridComponent])
			this.#classes = [...this.#components.keys()]
		}
	}

	deleteComponent(Component: ComponentClass) {
		const component = this.#components.get(Component)
		if (component) {
			this.#components.delete(Component)

			const ikeys: string[] = []
			for (const [ikey, [C]] of this.#cache) {
				if (C === Component)
					ikeys.push(ikey)
			}

			for (const ikey of ikeys)
				this.#cache.delete(ikey)

			this.#classes = [...this.#components.keys()]

			if (component instanceof HybridComponent)
				component.deleted()
		}
	}

	call_deleted_on_all_hybrid_components() {
		for (const [, component, isHybrid] of this.#cache.values())
			if (isHybrid)
				(component as HybridComponent<any, any>).deleted()
	}

	#grab(ikey: string) {
		const result = this.#cache.get(ikey)
		if (!result)
			throw new Error(`failed to get component data for "${ikey}"`)
		return result
	}

	readonly data = new Proxy({}, {
		get: (_, ikey: string) => {
			const [,component, isHybrid] = this.#grab(ikey)
			if (isHybrid)
				return component
			else
				return component.state
		},
		set: (_, ikey: string, value: any) => {
			const [,component, isHybrid] = this.#grab(ikey)
			if (isHybrid)
				throw new Error(`cannot directly overwrite hybrid component "${ikey}"`)
			else
				component.state = value
			return true
		},
	}) as Resolve<Sel>
}

export class Query<Sel extends Selector> {
	matches = new Map<Id, Resolve<Sel>>()
	#types: ComponentClass[] = []

	constructor(public readonly selector: Sel) {
		this.#types = Object.values(selector)
	}

	same(bravo: Selector) {
		const alpha = this.selector
		const a = Object.values(alpha)
		const b = Object.values(bravo)
		return a.length === b.length
			? a.every(C => b.includes(C))
			: false
	}

	consider([id, entity]: Entry<any>) {
		if (entity.match(this.#types))
			this.matches.set(id, entity.data)
		else
			this.matches.delete(id)
	}

	remove(id: Id) {
		this.matches.delete(id)
	}
}

export class World<Realm> {
	id = id_counter()
	entities = new Map<Id, Entity<Realm>>()
	queries = new Set<Query<any>>()
	#realm: Realm

	constructor(realm: Realm) {
		this.#realm = realm
	}

	#find_query<Sel extends Selector>(selector: Sel) {
		for (const query of this.queries) {
			if (query.same(selector))
				return query as Query<Sel>
		}
	}

	/** create a persistent query for this world, and prevent any duplicates */
	query<Sel extends Selector>(selector: Sel) {
		let query = this.#find_query(selector)

		if (!query) {
			query = new Query(selector)
			this.queries.add(query)
			query.matches.clear()
			for (const entry of this.entities.entries())
				query.consider(entry)
		}

		return query
	}

	#reindex_queries(id: Id, entity: Entity<Realm>) {
		const entry: Entry<Realm> = [id, entity]
		for (const query of this.queries)
			query.consider(entry)
	}

	add<Sel extends Selector>(entity: Entity<Realm, Sel>) {
		const id = this.id()
		this.entities.set(id, entity)
		const entry: Entry<Realm> = [id, entity]
		for (const query of this.queries)
			query.consider(entry)
		return [id, entity.data] as [Id, Resolve<Sel>]
	}

	/** get a specific entity, and a subset of its components */
	get<Sel extends Selector>(id: Id, selector: Sel) {
		const entity = this.entities.get(id)! as Entity<Realm, Sel>

		if (!entity)
			throw new Error(`entity not found "${id}"`)

		if (!entity.match(Object.values(selector)))
			throw new Error(`entity did not match selector "${id}", {${Object.keys(selector).join(", ")}}`)

		return entity.data
	}

	/** create a new entity */
	create<Sel extends Selector>(selector: Sel, params: ComponentParams<Sel>) {
		const entity = Entity.create(this.#realm, selector, params)
		return this.add<Sel>(entity)
	}

	/** create new components and attach them to an entity */
	attach<Sel extends Selector>(id: Id, selector: Sel, params: ComponentParams<Sel>) {
		const entity = this.entities.get(id)!
		entity.createComponents(selector, params)
		this.#reindex_queries(id, entity)
	}

	/** detach components from an entity by type */
	detach(id: Id, Components: ComponentClass[]) {
		const entity = this.entities.get(id)!
		for (const Component of Components)
			entity.deleteComponent(Component)
		this.#reindex_queries(id, entity)
	}

	/** kill an entity and all its components */
	delete(id: Id) {
		const entity = this.entities.get(id)!
		this.entities.delete(id)
		for (const query of this.queries)
			query.remove(id)
		entity.call_deleted_on_all_hybrid_components()
	}
}

////////
//////// EXECUTIVE
////////

export type Unit<Realm, Tick> = (
	| System<Realm, Tick>
	| Behavior<Realm, Tick, any>
)

export type BehaviorFn<Realm, Tick, Sel extends Selector> = (
	({}: {world: World<Realm>, realm: Realm, tick: Tick}) =>
		(components: Resolve<Sel>, id: Id) => void
)

export class Behavior<Realm, Tick, Sel extends Selector> {
	constructor(
		public name: string,
		public selector: Sel,
		public fn: BehaviorFn<Realm, Tick, Sel>,
	) {}
}

type WalkFns = {
	unit?: (unit: Unit<any, any>) => void
	system?: (system: System<any, any>) => void
	behavior?: (behavior: Behavior<any, any, any>) => void
}

export class System<Realm, Tick> {
	constructor(
		public name: string,
		public children: Unit<Realm, Tick>[],
	) {}

	walk(fns: WalkFns) {
		System.walk(this, fns)
	}

	static walk(system: System<any, any>, fns: WalkFns) {
		const {
			unit: fnUnit = () => {},
			system: fnSystem = () => {},
			behavior: fnBehavior = () => {},
		} = fns

		fnUnit(system)
		fnSystem(system)

		for (const unit of system.children) {
			if (unit instanceof Behavior) {
				fnUnit(unit)
				fnBehavior(unit)
			}
			else if (unit instanceof System) {
				fnUnit(unit)
				fnSystem(unit)
				this.walk(unit, fns)
			}
			else {
				throw new Error(`invalid unit in system "${system.name}"`)
			}
		}
	}
}

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
		})
	}

	execute(tick: Tick) {
		const world = this.#world
		const realm = this.#realm
		for (const [behavior, query] of this.#mandates) {
			const fn2 = behavior.fn({world, realm, tick})
			for (const [id, components] of query.matches)
				fn2(components, id)
		}
	}
}

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

	executive = (realm: Realm, world: World<Realm>, system: System<Realm, Tick>) => (
		new Executive<Realm, Tick>(realm, world, system)
	)

	archetype = <P extends any[], X>(
		fn: (world: World<Realm>) => (...p: P) => X
	) => fn
}

////////////////////////////////
////////////////////////////////
////////////////////////////////

// class MyBase {
// 	containers: any
// 	constructor(public scene: Scene) {}
// }
// class MyTick {}
// const hub = new Hub<MyBase, MyTick>()

// class Position extends Component<Vec3> {}
// class Rotation extends Component<Quat> {}
// class Box extends HybridComponent<MyBase, {}> {
// 	mesh = MeshBuilder.CreateBox("box", {size: 1}, this.base.scene)
// 	init() {}
// 	deleted() {
// 		this.mesh.dispose()
// 	}
// }
// class Glb extends HybridComponent<MyBase, {container_name: string}> {
// 	instanced = this.base.containers[this.state.container_name].instantiate()
// 	init() {}
// 	deleted() {
// 		this.instanced.dispose()
// 	}
// }

// /////////

// const {system, behavior} = hub
// export const systems = system("coolsystem", [

// 	behavior("positions do be moving forward")
// 		.select({Position})
// 		.act(() => components => components.position[2] += 1 / 60),

// 	behavior("box do be updating")
// 		.select({Box, Position, Rotation})
// 		.act(() => components => {
// 			const {box, position, rotation} = components
// 			box.mesh.position.set(...position)
// 			if (box.mesh.rotationQuaternion)
// 				box.mesh.rotationQuaternion.set(...rotation)
// 			else
// 				box.mesh.rotationQuaternion = babylonian.from.quat(rotation)
// 		}),
// ])

// /////////

// const world = new World()
// const base = new MyBase(undefined as any)
// const executive = hub.executive(base, world, systems)
// executive.execute(new MyTick())

