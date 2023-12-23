
// import {Scene} from "@babylonjs/core/scene.js"
// import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"
// import {PhysicsBody} from "@babylonjs/core/Physics/v2/physicsBody.js"
// import {PhysicsMotionType, PhysicsShapeType} from "@babylonjs/core/Physics/v2/IPhysicsEnginePlugin.js"
// import { PhysicsShape } from "@babylonjs/core/Physics/v2/physicsShape"
// import { Vec3 } from "../../../../tools/math/vec3"
// import { Quat } from "../../../../tools/math/quat"
// import { Mesh } from "@babylonjs/core/Meshes/mesh"

// export type PhysParams = {
// 	scene: Scene
// 	node: TransformNode
// 	mass: number
// 	restitution: number
// 	friction: number
// 	motion: PhysMotion
// 	shape: PhysShape
// 	initially_sleeping: boolean
// }

// export type PhysMotion = (
// 	| "static"
// 	| "dynamic"
// 	| "animated"
// )

// export type PhysShapeKind = (
// 	| "box"
// 	| "sphere"
// 	| "cylinder"
// 	| "capsule"
// 	| "mesh"
// 	| "convex"
// 	| "container"
// )

// export type PhysBox = {
// 	type: "box"
// 	center: Vec3
// 	rotation: Quat
// 	extents: Vec3
// }

// export type PhysSphere = {
// 	type: "sphere"
// 	radius: number
// }

// export type PhysCylinder = {
// 	type: "cylinder"
// 	radius: number
// 	pointA: Vec3
// 	pointB: Vec3
// }

// export type PhysCapsule = {
// 	type: "capsule"
// 	radius: number
// 	pointA: Vec3
// 	pointB: Vec3
// }

// export type PhysMesh = {
// 	type: "mesh"
// 	mesh: Mesh
// 	includeChildMeshes: boolean
// }

// export type PhysConvex = {
// 	type: "convex"
// 	mesh: Mesh
// 	includeChildMeshes: boolean
// }

// export type PhysContainer = {
// 	type: "container"
// }

// export class Phys {
// 	constructor(p: PhysParams) {
// 		const body = new PhysicsBody(
// 			p.node,
// 			this.#motion(p.motion),
// 			p.initially_sleeping,
// 			p.scene,
// 		)
// 		const shape = new PhysicsShape({
// 			type: this.#shape(p.shape),
// 		}, p.scene)
// 	}

// 	#motion(concept: PhysMotion) {
// 		switch (concept) {
// 			case "static": return PhysicsMotionType.STATIC
// 			case "dynamic": return PhysicsMotionType.DYNAMIC
// 			case "animated": return PhysicsMotionType.ANIMATED
// 		}
// 	}

// 	#shape(concept: PhysShape) {
// 		switch (concept) {
// 			case "box": return PhysicsShapeType.BOX
// 			case "sphere": return PhysicsShapeType.SPHERE
// 			case "cylinder": return PhysicsShapeType.CYLINDER
// 			case "capsule": return PhysicsShapeType.CAPSULE
// 			case "mesh": return PhysicsShapeType.MESH
// 			case "convex": return PhysicsShapeType.CONVEX_HULL
// 			case "container": return PhysicsShapeType.CONTAINER
// 		}
// 	}
// }

