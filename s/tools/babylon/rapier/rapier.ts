
import Rapier from "@dimforge/rapier3d-compat/rapier.es.js"
await (Rapier as any).init()

import {Scene} from "@babylonjs/core/scene.js"
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {Color3} from "@babylonjs/core/Maths/math.color.js"
import {Material} from "@babylonjs/core/Materials/material.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"
import {VertexData} from "@babylonjs/core/Meshes/mesh.vertexData.js"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"
import {PBRMaterial} from "@babylonjs/core/Materials/PBR/pbrMaterial.js"

import {quat} from "../../math/quat.js"
import {Vec3, vec3} from "../../math/vec3.js"
import {babylonian} from "../../math/babylonian.js"

export type Container<X> = {
	value: X
	dispose: () => void
}

export const asContainer = <X>(r: Container<X>) => r

export type Body = {
	transform: TransformNode
	rigid: Rapier.RigidBody
	collider: Rapier.Collider
}

export class BabylonRapierPhysics {
	#scene: Scene
	#world: Rapier.World

	#counter = 0
	#synchronizedBodies = new Set<Body>()

	constructor({scene, gravity, timestep}: {
			scene: Scene,
			gravity: Vec3,
			timestep: number,
		}) {
		this.#scene = scene
		this.#world = new Rapier.World(vec3.to.xyz(gravity))
		this.#world.timestep = timestep
	}

	#label(n: string) {
		return `${n}::${this.#counter++}`
	}

	#new_transform_node() {
		return new TransformNode(this.#label("physics_transform"), this.#scene)
	}

	#debug_material(color: Vec3) {
		const m = new PBRMaterial(
			this.#label("physics_debug_material"),
			this.#scene,
		)
		m.albedoColor = new Color3(...color)
		m.metallic = 0
		m.roughness = 1
		m.alpha = 0.2
		return m
	}

	colors = {
		red: this.#debug_material([1, .2, .2]),
		blue: this.#debug_material([.2, .2, 1]),
		cyan: this.#debug_material([.2, 1, 1]),
		green: this.#debug_material([.2, 1, .2]),
	}

	body(
			transform: TransformNode,
			rigidDesc: Rapier.RigidBodyDesc,
			colliderDesc: Rapier.ColliderDesc,
		) {
		const rigid = this.#world.createRigidBody(rigidDesc)
		const collider = this.#world.createCollider(colliderDesc, rigid)
		const body: Body = {transform, rigid, collider}
		this.#synchronizedBodies.add({transform, rigid, collider})
		return asContainer({
			value: body,
			dispose: () => {
				this.#synchronizedBodies.delete(body)
				this.#world.removeCollider(collider, false)
				this.#world.removeRigidBody(rigid)
			},
		})
	}

	box(spec: {
			density: number
			dimensions: Vec3
			material: Material
		}) {

		const rigid = Rapier
			.RigidBodyDesc
			.dynamic()

		const collider = Rapier
			.ColliderDesc
			.cuboid(...vec3.divideBy(spec.dimensions, 2))
			.setDensity(spec.density)

		const transform = this.#new_transform_node()
		const container = this.body(transform, rigid, collider)
		const [width, height, depth] = spec.dimensions

		const mesh = MeshBuilder.CreateBox(
			this.#label("physics_visual_box"),
			{width, height, depth},
			this.#scene,
		)

		mesh.material = spec.material ?? this.colors.red
		mesh.setParent(transform)

		return asContainer({
			value: {transform, rigid, collider, mesh},
			dispose: () => {
				container.dispose()
				mesh.dispose()
			},
		})
	}

	character(size: {halfHeight: number, radius: number}) {
		const controller = this.#world.createCharacterController(0.01)
		const transform = this.#new_transform_node()

		const container = this.body(
			transform,
			Rapier.RigidBodyDesc.kinematicPositionBased(),
			Rapier.ColliderDesc.capsule(size.halfHeight, size.radius),
		)

		const {rigid, collider} = container.value

		const applyMovement = (velocity: Vec3) => {
			controller.computeColliderMovement(
				collider,
				vec3.to.xyz(velocity),
			)
			const grounded = controller.computedGrounded()
			const movement = controller.computedMovement()
			const newPosition = vec3.to.xyz(
				vec3.add(
					vec3.from.xyz(rigid.translation()),
					vec3.from.xyz(movement),
				)
			)
			rigid.setNextKinematicTranslation(newPosition)
			return {grounded, movement}
		}

		const mesh = MeshBuilder.CreateCapsule(
			this.#label("capsule"),
			{radius: size.radius, height: 2 * (size.halfHeight + size.radius)},
			this.#scene,
		)

		mesh.material = this.colors.cyan
		mesh.setParent(transform)

		return asContainer({
			value: {transform, rigid, collider, mesh, applyMovement},
			dispose: () => {
				this.#world.removeCharacterController(controller)
				container.dispose()
			},
		})
	}

	static_trimesh(mesh: Mesh) {
		const {positions, indices} = VertexData.ExtractFromMesh(mesh)

		const rigid = this.#world.createRigidBody(
			Rapier.RigidBodyDesc.fixed()
		)

		const collider = this.#world.createCollider(
			Rapier.ColliderDesc.trimesh(
				new Float32Array(positions!),
				new Uint32Array(indices!),
			),
			rigid,
		)

		return asContainer({
			value: {rigid, collider},
			dispose: () => {
				this.#world.removeCollider(collider, false)
				this.#world.removeRigidBody(rigid)
			},
		})
	}

	step() {
		this.#world.step()

		// update babylon positions and rotations
		for (const {transform, rigid} of this.#synchronizedBodies) {
			transform.position.set(...vec3.from.xyz(rigid.translation()))

			if (transform.rotationQuaternion)
				transform.rotationQuaternion.set(
					...quat.from.xyzw(rigid.rotation())
				)
			else
				transform.rotationQuaternion = babylonian.from.quat(
					quat.from.xyzw(rigid.rotation())
				)
		}
	}
}

