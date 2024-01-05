
import Rapier from "@dimforge/rapier3d-compat/rapier.es.js"
await (Rapier as any).init()

import {Scene} from "@babylonjs/core/scene.js"
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {Color3} from "@babylonjs/core/Maths/math.color.js"
import {Material} from "@babylonjs/core/Materials/material.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"
import {VertexData} from "@babylonjs/core/Meshes/mesh.vertexData.js"
import {PBRMaterial} from "@babylonjs/core/Materials/PBR/pbrMaterial.js"
import {Quaternion, Vector3} from "@babylonjs/core/Maths/math.vector.js"

import {Quat, quat} from "../../math/quat.js"
import {Vec3, vec3} from "../../math/vec3.js"
import { babylonian } from "../../math/babylonian.js"

export type Container = {
	dispose: () => void
}

export const containerize = <X extends Container>(c: X) => c

export type Body = {
	rigid: Rapier.RigidBody
	collider: Rapier.Collider
	position: Vector3
	rotation: Quaternion
}

export class BabylonRapierPhysics {
	#scene: Scene
	#world: Rapier.World

	#counter = 0
	#bodies = new Set<Body>()

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
			rigidDesc: Rapier.RigidBodyDesc,
			colliderDesc: Rapier.ColliderDesc,
		) {

		const rigid = this.#world.createRigidBody(rigidDesc)
		const collider = this.#world.createCollider(colliderDesc, rigid)

		const position = Vector3.Zero()
		const rotation = Quaternion.Identity()

		const body: Body = {rigid, collider, position, rotation}
		this.#bodies.add(body)

		return containerize({
			...body,
			dispose: () => {
				this.#bodies.delete(body)
				this.#world.removeCollider(collider, false)
				this.#world.removeRigidBody(rigid)
			},
		})
	}

	box(spec: {
			scale: Vec3
			density: number
			position?: Vec3
			rotation?: Quat
			material?: Material
		}) {

		const [width, height, depth] = spec.scale

		const body = this.body(
			Rapier.RigidBodyDesc
				.dynamic(),
			Rapier.ColliderDesc
				.cuboid(...vec3.divideBy(spec.scale, 2))
				.setDensity(spec.density),
		)

		if (spec.position)
			body.rigid.setTranslation(vec3.to.xyz(spec.position), true)

		if (spec.rotation)
			body.rigid.setRotation(quat.to.xyzw(spec.rotation), true)

		this.#synchronize(body)

		const mesh = MeshBuilder.CreateBox(
			this.#label("physics_visual_box"),
			{width, height, depth},
			this.#scene,
		)

		mesh.position = body.position
		mesh.rotationQuaternion = body.rotation
		mesh.material = spec.material ?? this.colors.red

		return containerize({
			mesh,
			rigid: body.rigid,
			collider: body.collider,
			dispose: () => {
				mesh.dispose()
				body.dispose()
			},
		})
	}

	character(size: {halfHeight: number, radius: number}) {
		const controller = this.#world.createCharacterController(0.01)

		const body = this.body(
			Rapier.RigidBodyDesc.kinematicPositionBased(),
			Rapier.ColliderDesc.capsule(size.halfHeight, size.radius),
		)

		const applyMovement = (velocity: Vec3) => {
			controller.computeColliderMovement(
				body.collider,
				vec3.to.xyz(velocity),
			)
			const grounded = controller.computedGrounded()
			const movement = controller.computedMovement()
			const newPosition = vec3.to.xyz(
				vec3.add(
					vec3.from.xyz(body.rigid.translation()),
					vec3.from.xyz(movement),
				)
			)
			body.rigid.setNextKinematicTranslation(newPosition)
			return {grounded, movement}
		}

		const mesh = MeshBuilder.CreateCapsule(
			this.#label("capsule"),
			{radius: size.radius, height: 2 * (size.halfHeight + size.radius)},
			this.#scene,
		)

		mesh.position = body.position
		mesh.rotationQuaternion = body.rotation
		mesh.material = this.colors.cyan

		return containerize({
			...body,
			mesh,
			applyMovement,
			dispose: () => {
				this.#world.removeCharacterController(controller)
				body.dispose()
			},
		})
	}

	static_trimesh(mesh: Mesh) {
		const data = VertexData.ExtractFromMesh(mesh)
		const indices = new Uint32Array(data.indices!)
		const scale = babylonian.to.vec3(mesh.absoluteScaling)
		const positions = (new Float32Array(data.positions!))
			.map((p, i) => p * scale[i % 3])

		const rigid = this.#world.createRigidBody(
			Rapier.RigidBodyDesc
				.fixed()
				.setTranslation(...babylonian.to.vec3(mesh.absolutePosition))
				.setRotation(mesh.absoluteRotationQuaternion)
		)

		const collider = this.#world.createCollider(
			Rapier.ColliderDesc.trimesh(
				new Float32Array(positions!),
				new Uint32Array(indices!),
			),
			rigid,
		)

		return containerize({
			rigid,
			collider,
			dispose: () => {
				this.#world.removeCollider(collider, false)
				this.#world.removeRigidBody(rigid)
			},
		})
	}

	step() {
		this.#world.step()
		for (const body of this.#bodies)
			this.#synchronize(body)
	}

	#synchronize({rigid, position, rotation}: Body) {
		position.set(...vec3.from.xyz(rigid.translation()))
		rotation.set(...quat.from.xyzw(rigid.rotation()))
	}
}

