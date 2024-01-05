
import {Scene} from "@babylonjs/core/scene.js"
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {Material} from "@babylonjs/core/Materials/material.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"
import {VertexData} from "@babylonjs/core/Meshes/mesh.vertexData.js"
import {InstancedMesh} from "@babylonjs/core/Meshes/instancedMesh.js"
import {Quaternion, Vector3} from "@babylonjs/core/Maths/math.vector.js"

import {Rapier} from "./rapier.js"
import {labeler} from "../tools/labeler.js"
import {Quat, quat} from "../tools/math/quat.js"
import {Vec3, vec3} from "../tools/math/vec3.js"
import {gravitation} from "./parts/gravitation.js"
import {debug_colors} from "../tools/debug_color.js"
import {CharacterCapsule, Physical} from "./types.js"
import {transform_vertex_data} from "./parts/transform_vertex_data.js"

/**
 * rapier physics integration for babylon.
 */
export class Physics {
	#scene: Scene
	#world: Rapier.World
	#label = labeler("physics")
	#physicals = new Set<Physical>()
	#colors: ReturnType<typeof debug_colors>

	constructor({scene, gravity, timestep}: {
			scene: Scene,
			gravity: Vec3,
			timestep: number,
		}) {
		this.#scene = scene
		this.#world = new Rapier.World(vec3.to.xyz(gravity))
		this.#world.timestep = timestep
		this.#colors = debug_colors(scene)
	}

	/**
	 * add a rigidbody to the physics simulation,
	 * which is synchronized with a babylon position and rotation.
	 */
	physical(
			rigidDesc: Rapier.RigidBodyDesc,
			colliderDesc: Rapier.ColliderDesc,
		) {
		const rigid = this.#world.createRigidBody(rigidDesc)
		const collider = this.#world.createCollider(colliderDesc, rigid)
		const physical: Physical = {
			rigid,
			collider,
			position: Vector3.Zero(),
			rotation: Quaternion.Identity(),
			dispose: () => {
				this.#physicals.delete(physical)
				this.#world.removeCollider(collider, false)
				this.#world.removeRigidBody(rigid)
			},
		}
		this.#physicals.add(physical)
		return physical
	}

	/**
	 * create a box physics simulation
	 */
	box(spec: {
			scale: Vec3
			density: number
			position?: Vec3
			rotation?: Quat
			material?: Material
		}) {

		const [width, height, depth] = spec.scale

		const physical = this.physical(
			Rapier.RigidBodyDesc
				.dynamic(),
			Rapier.ColliderDesc
				.cuboid(...vec3.divideBy(spec.scale, 2))
				.setDensity(spec.density),
		)

		if (spec.position)
			physical.rigid.setTranslation(vec3.to.xyz(spec.position), true)

		if (spec.rotation)
			physical.rigid.setRotation(quat.to.xyzw(spec.rotation), true)

		this.#synchronize(physical)

		const mesh = MeshBuilder.CreateBox(
			this.#label("physics_visual_box"),
			{width, height, depth},
			this.#scene,
		)

		mesh.position = physical.position
		mesh.rotationQuaternion = physical.rotation
		mesh.material = spec.material ?? this.#colors.red

		return {
			mesh,
			rigid: physical.rigid,
			collider: physical.collider,
			dispose: () => {
				mesh.dispose()
				physical.dispose()
			},
		}
	}

	/**
	 * create a kinematic character controller
	 */
	character_capsule(spec: {
			density: number
			radius: number
			halfHeight: number
		}) {

		const controller = this.#world.createCharacterController(0.01)

		const body = this.physical(
			Rapier.RigidBodyDesc.kinematicPositionBased(),
			Rapier.ColliderDesc.capsule(spec.halfHeight, spec.radius),
		)

		const applyMovement = (velocity: Vec3) => {
			const velocity_with_gravity = vec3.add(
				velocity,
				gravitation(this.#world),
			)

			controller.computeColliderMovement(
				body.collider,
				vec3.to.xyz(velocity_with_gravity),
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

			return {
				grounded,
				movement: vec3.from.xyz(movement),
			}
		}

		const mesh = MeshBuilder.CreateCapsule(
			this.#label("capsule"),
			{radius: spec.radius, height: 2 * (spec.halfHeight + spec.radius)},
			this.#scene,
		)

		mesh.position = body.position
		mesh.rotationQuaternion = body.rotation
		mesh.material = this.#colors.cyan

		const capsule: CharacterCapsule = {
			...body,
			mesh,
			applyMovement,
			dispose: () => {
				this.#world.removeCharacterController(controller)
				body.dispose()
			},
		}

		return capsule
	}

	/**
	 * turn a mesh into a fixed physical boundary.
	 */
	static_trimesh(mesh: Mesh | InstancedMesh) {
		const source = mesh instanceof InstancedMesh
			? mesh.sourceMesh
			: mesh

		const data = VertexData.ExtractFromMesh(source)
		const {positions, indices} = transform_vertex_data(data, mesh)

		const rigid = this.#world.createRigidBody(
			Rapier.RigidBodyDesc.fixed()
		)

		const collider = this.#world.createCollider(
			Rapier.ColliderDesc.trimesh(positions, indices),
			rigid,
		)

		return {
			rigid,
			collider,
			dispose: () => {
				this.#world.removeCollider(collider, false)
				this.#world.removeRigidBody(rigid)
			},
		}
	}

	/**
	 * advance the physical simulation by one tick
	 */
	step() {
		this.#world.step()

		for (const body of this.#physicals)
			this.#synchronize(body)
	}

	#synchronize({rigid, position, rotation}: Physical) {
		position.set(...vec3.from.xyz(rigid.translation()))
		rotation.set(...quat.from.xyzw(rigid.rotation()))
	}
}

