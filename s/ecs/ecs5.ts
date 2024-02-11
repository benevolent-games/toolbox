
import {Vec3} from "../math/vec3.js"
import {Quat} from "../math/quat.js"
import {Constructor} from "@benev/slate"
import {Scene} from "@babylonjs/core/scene.js"
import {babylonian} from "../math/babylonian.js"
import {id_counter} from "../tools/id_counter.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"

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

export type AComponent = Component<any>
export type CComponent = Constructor<AComponent>
export type Selector = Record<string, CComponent>
export type Entry = [Id, Entity]

export type Resolve<Sel extends Selector> = {
	[K in keyof Sel as K extends string ? Lowercase<K>: never]:
		InstanceType<Sel[K]> extends HybridComponent<any, any>
			? InstanceType<Sel[K]> // return the whole hybrid component instance, to do ugly advanced work
			: InstanceType<Sel[K]>["state"] // return only the state object, making for clean pure logic
}

////////
//////// FUNDAMENTALS
////////

export abstract class Component<State extends Serializable> {
	constructor(public state: State) {}
}

export abstract class HybridComponent<
		Base,
		State extends Serializable,
	> extends Component<State> {
	constructor(public base: Base, state: State) { super(state) }
	abstract deleted(): void
}

export class Entity {
	components = new Map<CComponent, AComponent>()
}

export class Query<Sel extends Selector> {
	matches = new Map<Id, Resolve<Sel>>()
	#selectorEntries: [string, CComponent][]

	constructor(public selector: Sel) {
		this.#selectorEntries = Object.entries(selector)
	}

	same(bravo: Selector) {
		const alpha = this.selector
		const a = Object.values(alpha)
		const b = Object.values(bravo)
		return a.length === b.length
			? a.every(C => b.includes(C))
			: false
	}

	#match(entity: Entity) {
		const selectorComponents = Object.values(this.selector)
		const entityComponents = [...entity.components.keys()]
		return selectorComponents.every(C => entityComponents.includes(C))
	}

	#resolve(entity: Entity) {
		let resolved: any = {}
		for (const [key, Component] of this.#selectorEntries) {
			const component = entity.components.get(Component)!
			resolved[key.toLowerCase()] = (
				component instanceof HybridComponent
					? component
					: component.state
			)
		}
		return resolved as Resolve<Sel>
	}

	consider([id, entity]: Entry) {
		if (this.#match(entity))
			this.matches.set(id, this.#resolve(entity))
		else
			this.matches.delete(id)
	}

	remove(id: Id) {
		this.matches.delete(id)
	}
}

export class World {
	id = id_counter()
	entities = new Map<Id, Entity>()
	queries = new Set<Query<any>>()

	#find_query<Sel extends Selector>(selector: Sel) {
		for (const query of this.queries) {
			if (query.same(selector))
				return query as Query<Sel>
		}
	}

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

	add(entity: Entity) {
		const id = this.id()
		this.entities.set(id, entity)

		const entry: Entry = [id, entity]
		for (const query of this.queries)
			query.consider(entry)
	}

	reconsider(id: Id) {
		const entity = this.entities.get(id)!
		const entry: Entry = [id, entity]
		for (const query of this.queries)
			query.consider(entry)
	}

	remove(id: Id) {
		const entity = this.entities.get(id)!
		this.entities.delete(id)

		for (const query of this.queries)
			query.remove(id)

		for (const component of entity.components.values()) {
			if (component instanceof HybridComponent)
				component.deleted()
		}
	}
}

////////
//////// EXECUTIVE
////////

export type Unit<Base, Tick> = (
	| System<Base, Tick>
	| Behavior<Base, Tick, any>
)

export type BehaviorFn<Base, Tick, Sel extends Selector> = (
	({}: {base: Base, tick: Tick}) =>
		(components: Resolve<Sel>, id: Id) => void
)

export class Behavior<Base, Tick, Sel extends Selector> {
	constructor(
		public name: string,
		public selector: Sel,
		public fn: BehaviorFn<Base, Tick, Sel>,
	) {}
}

type WalkFns = {
	unit?: (unit: Unit<any, any>) => void
	system?: (system: System<any, any>) => void
	behavior?: (behavior: Behavior<any, any, any>) => void
}

export class System<Base, Tick> {
	constructor(
		public name: string,
		public children: Unit<Base, Tick>[],
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

export class Executive<Base, Tick> {
	#base: Base
	#mandates: [Behavior<Base, Tick, any>, query: Query<any>][] = []

	constructor(
			base: Base,
			world: World,
			system: System<Base, Tick>,
		) {

		this.#base = base

		system.walk({
			behavior: b => this.#mandates.push([b, world.query(b.selector)]),
		})
	}

	execute(tick: Tick) {
		const base = this.#base
		for (const [behavior, query] of this.#mandates) {
			const fn2 = behavior.fn({base, tick})
			for (const [id, components] of query.matches)
				fn2(components, id)
		}
	}
}

export class Hub<Base, Tick> {
	world = () => new World()

	system = (name: string, children: Unit<Base, Tick>[]) => (
		new System<Base, Tick>(name, children)
	)

	behavior = (name: string) => ({
		select: <Sel extends Selector>(selector: Sel) => ({
			act: (fn: BehaviorFn<Base, Tick, Sel>) => (
				new Behavior<Base, Tick, Sel>(name, selector, fn)
			),
		}),
	})

	executive = (base: Base, world: World, system: System<Base, Tick>) => (
		new Executive<Base, Tick>(base, world, system)
	)
}

////////////////////////////////
////////////////////////////////
////////////////////////////////

class MyBase {
	containers: any
	constructor(public scene: Scene) {}
}
class MyTick {}
const hub = new Hub<MyBase, MyTick>()

class Position extends Component<Vec3> {}
class Rotation extends Component<Quat> {}
class Box extends HybridComponent<MyBase, {}> {
	mesh = MeshBuilder.CreateBox("box", {size: 1}, this.base.scene)
	updated() {}
	deleted() {
		this.mesh.dispose()
	}
}
class Glb extends HybridComponent<MyBase, {container_name: string}> {
	instanced = this.base.containers[this.state.container_name].instantiate()
	updated() {}
	deleted() {
		this.instanced.dispose()
	}
}

/////////

const {system, behavior} = hub
export const systems = system("coolsystem", [

	behavior("positions do be moving forward")
		.select({Position})
		.act(() => components => components.position[2] += 1 / 60),

	behavior("box do be updating")
		.select({Box, Position, Rotation})
		.act(() => components => {
			const {box, position, rotation} = components
			box.mesh.position.set(...position)
			if (box.mesh.rotationQuaternion)
				box.mesh.rotationQuaternion.set(...rotation)
			else
				box.mesh.rotationQuaternion = babylonian.from.quat(rotation)
		}),
])

/////////

const world = new World()
const base = new MyBase(undefined as any)
const executive = hub.executive(base, world, systems)
executive.execute(new MyTick())

