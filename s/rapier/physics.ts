
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
import {synchronize} from "./parts/synchronize.js"
import {debug_colors} from "../tools/debug_colors.js"
import {CharacterCapsule, Physical} from "./types.js"
// import {make_limited_logger} from "../tools/limited_logger.js"
import {transform_vertex_data} from "./parts/transform_vertex_data.js"
import {make_apply_movement_fn} from "./parts/make_apply_movement_fn.js"
import { scalar } from "../tools/math/scalar.js"

const constants = {
	contact_force_threshold: 0.5,
}

// const log = make_limited_logger(100)

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
	 * advance the physical simulation by one tick
	 */
	step() {
		this.#world.step()

		for (const body of this.#physicals)
			synchronize(body)
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
				.setDensity(spec.density)
				.setActiveEvents(
					Rapier.ActiveEvents.COLLISION_EVENTS |
					Rapier.ActiveEvents.CONTACT_FORCE_EVENTS
				)
				.setContactForceEventThreshold(constants.contact_force_threshold),
		)

		if (spec.position)
			physical.rigid.setTranslation(vec3.to.xyz(spec.position), true)

		if (spec.rotation)
			physical.rigid.setRotation(quat.to.xyzw(spec.rotation), true)

		synchronize(physical)

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
		}): CharacterCapsule {

		const controller = this.#world.createCharacterController(0.01)

		controller.setSlideEnabled(true)
		controller.setApplyImpulsesToDynamicBodies(true)
		controller.enableSnapToGround(spec.halfHeight)
		controller.enableAutostep(spec.halfHeight, spec.radius, true)
		controller.setMaxSlopeClimbAngle(scalar.radians(46))
		controller.setMinSlopeSlideAngle(scalar.radians(75))

		const physical = this.physical(
			Rapier.RigidBodyDesc
				.kinematicPositionBased(),

			Rapier.ColliderDesc
				.capsule(spec.halfHeight, spec.radius)
				.setActiveEvents(
					Rapier.ActiveEvents.COLLISION_EVENTS |
					Rapier.ActiveEvents.CONTACT_FORCE_EVENTS
				)
				.setContactForceEventThreshold(constants.contact_force_threshold),
		)

		const mesh = MeshBuilder.CreateCapsule(
			this.#label("capsule"),
			{radius: spec.radius, height: 2 * (spec.halfHeight + spec.radius)},
			this.#scene,
		)

		mesh.position = physical.position
		mesh.rotationQuaternion = physical.rotation
		mesh.material = this.#colors.cyan

		return {
			...physical,
			mesh,
			applyMovement: make_apply_movement_fn(
				this.#world,
				controller,
				physical,
			),
			dispose: () => {
				this.#world.removeCharacterController(controller)
				physical.dispose()
			},
		}
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
}

