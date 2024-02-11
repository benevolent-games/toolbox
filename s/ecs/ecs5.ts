
import {Vec3} from "../math/vec3.js"
import {Quat} from "../math/quat.js"
import {Constructor} from "@benev/slate"
import {babylonian} from "../math/babylonian.js"
import {id_counter} from "../tools/id_counter.js"
import {Scene} from "@babylonjs/core/scene.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"

export type Id = number
export type Serializable = (
	| string
	| number
	| boolean
	| null
	| Serializable[]
	| {[key: string]: Serializable}
)

export class Universe {
	id = id_counter()
}

export abstract class Component<Sta extends Serializable> {
	constructor(public state: Sta) {}
}

export abstract class HybridComponent<Uni extends Universe, Sta extends Serializable> extends Component<Sta> {
	constructor(public universe: Uni, state: Sta) { super(state) }
	abstract updated(): void
	abstract deleted(): void
}

export type AComponent = Component<any>
export type CComponent = Constructor<AComponent>

export class Entity {
	components = new Map<CComponent, AComponent>()
}

export class World {
	entities = new Map<Id, Entity>()
}

export type Selector = Record<string, CComponent>
export type Resolve<Sel extends Selector> = {
	[K in keyof Sel as K extends string ? Lowercase<K>: never]:
		InstanceType<Sel[K]> extends HybridComponent<any, any>
			? InstanceType<Sel[K]> // return the whole hybrid component instance, to do ugly advanced work
			: InstanceType<Sel[K]>["state"] // return only the state object, making for clean pure logic
}
export type ResolvedEntity<Sel extends Selector> = [Id, Resolve<Sel>]

export class Query<Sel extends Selector> {
	matching_entities: ResolvedEntity<Sel>[] = []
	constructor(public world: World, public selector: Sel) {}
	update() {
		for (const [_entityId, _entity] of this.world.entities) {
			// TODO
		}
	}
}

////////////////////////////////
////////////////////////////////
////////////////////////////////

class MyUniverse extends Universe {
	containers: any
	constructor(public scene: Scene) { super() }
}

class Position extends Component<Vec3> {}
class Rotation extends Component<Quat> {}
class Box extends HybridComponent<MyUniverse, {}> {
	mesh = MeshBuilder.CreateBox("box", {size: 1}, this.universe.scene)
	updated() {}
	deleted() {
		this.mesh.dispose()
	}
}

class Glb extends HybridComponent<MyUniverse, {container_name: string}> {
	instanced = this.universe.containers[this.state.container_name].instantiate()
	updated() {}
	deleted() {
		this.instanced.dispose()
	}
}

const world = new World()
const meshquery = new Query(world, {Box, Position, Rotation})

// this will be wrapped in a system soon
for (const [,x] of meshquery.matching_entities) {
	const {box, position, rotation} = x

	box.mesh.position.set(...position)

	if (box.mesh.rotationQuaternion)
		box.mesh.rotationQuaternion.set(...rotation)
	else
		box.mesh.rotationQuaternion = babylonian.from.quat(rotation)
}


































