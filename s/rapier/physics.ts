
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {InstancedMesh} from "@babylonjs/core/Meshes/instancedMesh.js"
import {Quaternion, Vector3} from "@babylonjs/core/Maths/math.vector.js"

import {Phys} from "./types.js"
import {Rapier} from "./rapier.js"
import {labeler} from "../tools/label.js"
import {Vec3, vec3} from "../tools/math/vec3.js"
import {debug_colors} from "../tools/debug_colors.js"
import {make_trimesh_rigid_and_collider} from "./aspects/trimesh.js"
import {synchronize_to_babylon_position_and_rotation} from "./parts/synchronize.js"
import {obtain_babylon_quaternion_from_mesh} from "../tools/obtain_babylon_quaternion_from_mesh.js"
import {apply_position_and_rotation, box_desc, create_babylon_mesh_for_box} from "./aspects/box.js"
import {CharacterSpec, character_desc, create_babylon_mesh_for_character, create_character_controller, make_apply_movement_fn} from "./aspects/character.js"

/**
 * rapier physics integration for babylon.
 */
export class Physics {
	#context: Phys.Context

	constructor({
			hz,
			scene,
			colors,
			gravity,
			contact_force_threshold = 0.2,
		}: Phys.Options) {

		const world = new Rapier.World(vec3.to.xyz(gravity))
		world.timestep = 1 / hz

		this.#context = {
			scene,
			world,
			physicals: new Set(),
			label: labeler("physics"),
			colors: colors ?? debug_colors(scene),
			contact_force_threshold,
		}
	}

	/**
	 * advance the physical simulation by one tick
	 */
	step() {
		this.#context.world.step()
		for (const body of this.#context.physicals)
			synchronize_to_babylon_position_and_rotation(body)
	}

	/**
	 * add a rigidbody to the physics simulation,
	 * which is synchronized with a babylon position and rotation.
	 */
	actor(desc: Phys.ActorDesc): Phys.Actor {
		const {world, physicals} = this.#context
		const rigid = this.#context.world.createRigidBody(desc.rigid)
		const collider = this.#context.world.createCollider(desc.collider, rigid)
		const physical: Phys.Actor = {
			rigid,
			collider,
			position: Vector3.Zero(),
			rotation: Quaternion.Identity(),
			dispose: () => {
				physicals.delete(physical)
				world.removeCollider(collider, false)
				world.removeRigidBody(rigid)
			},
		}
		physicals.add(physical)
		return physical
	}

	/**
	 * create a box physics simulation.
	 */
	box(spec: Phys.BoxSpec): Phys.BoxActor {
		const physical = this.actor(box_desc(this.#context, spec))
		apply_position_and_rotation(spec, physical)
		synchronize_to_babylon_position_and_rotation(physical)
		const mesh = create_babylon_mesh_for_box(
			this.#context, spec, physical, this.#context.colors.red,
		)
		return {
			...physical,
			mesh,
			dispose: () => {
				mesh.dispose()
				physical.dispose()
			},
		}
	}

	/**
	 * create a kinematic character controller capsule.
	 */
	character(spec: CharacterSpec): Phys.CharacterActor {
		const {world} = this.#context
		const controller = create_character_controller(this.#context, spec)
		const physical = this.actor(character_desc(this.#context, spec))
		const mesh = create_babylon_mesh_for_character(
			this.#context, spec, physical,
		)
		return {
			...physical,
			mesh,
			applyMovement: make_apply_movement_fn(
				world,
				controller,
				physical,
			),
			dispose: () => {
				mesh.dispose()
				world.removeCharacterController(controller)
				physical.dispose()
			},
		}
	}

	/**
	 * turn a mesh into a fixed boundary.
	 */
	trimesh(mesh: Mesh | InstancedMesh): Phys.TrimeshActor {
		const {world} = this.#context
		const {rigid, collider} = make_trimesh_rigid_and_collider(
			this.#context, mesh,
		)
		return {
			mesh,
			rigid,
			collider,
			position: mesh.position,
			rotation: obtain_babylon_quaternion_from_mesh(mesh),
			dispose: () => {
				world.removeCollider(collider, false)
				world.removeRigidBody(rigid)
			},
		}
	}

	fixture({position}: {
			position: Vec3
		}) {
		const {world} = this.#context
		const rigid = world.createRigidBody(
			Rapier.RigidBodyDesc
				.fixed()
				.setTranslation(...position)
		)
		const dispose = () => world.removeRigidBody(rigid)
		return {rigid, dispose}
	}

	joint_spherical({anchors: [a1, a2], bodies: [b1, b2]}: {
			anchors: [Vec3, Vec3]
			bodies: [Rapier.RigidBody, Rapier.RigidBody]
		}): Phys.Joint {

		const {world} = this.#context

		const joint = world.createImpulseJoint(
			Rapier.JointData.spherical(
				vec3.to.xyz(a1),
				vec3.to.xyz(a2),
			),
			b1,
			b2,
			true,
		)

		return {
			joint,
			dispose: () => {
				world.removeImpulseJoint(joint, true)
			},
		}
	}
}

