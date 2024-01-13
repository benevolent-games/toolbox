
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {InstancedMesh} from "@babylonjs/core/Meshes/instancedMesh.js"
import {Quaternion, Vector3} from "@babylonjs/core/Maths/math.vector.js"

import {Rapier} from "./rapier.js"
import {labeler} from "../tools/label.js"
import {vec3} from "../tools/math/vec3.js"
import {debug_colors} from "../tools/debug_colors.js"
import {make_trimesh_rigid_and_collider} from "./aspects/trimesh.js"
import {synchronize_to_babylon_position_and_rotation} from "./parts/synchronize.js"
import {BoxSpec, apply_position_and_rotation, box_desc, create_babylon_mesh_for_box} from "./aspects/box.js"
import {PhysicalCharacterCapsule, PhysContext, Physical, PhysicalDesc, PhysicsOptions, PhysicalBox} from "./types.js"
import {CharacterSpec, character_desc, create_babylon_mesh_for_character, create_character_controller, make_apply_movement_fn} from "./aspects/character.js"

/**
 * rapier physics integration for babylon.
 */
export class Physics {
	#context: PhysContext

	constructor({
			hz,
			scene,
			colors,
			gravity,
			contact_force_threshold = 0.2,
		}: PhysicsOptions) {

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
	physical(desc: PhysicalDesc) {
		const {world, physicals} = this.#context
		const rigid = this.#context.world.createRigidBody(desc.rigid)
		const collider = this.#context.world.createCollider(desc.collider, rigid)
		const physical: Physical = {
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
	box(spec: BoxSpec): PhysicalBox {
		const physical = this.physical(box_desc(this.#context, spec))
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
	character(spec: CharacterSpec): PhysicalCharacterCapsule {
		const {world} = this.#context
		const controller = create_character_controller(this.#context, spec)
		const physical = this.physical(character_desc(this.#context, spec))
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
	trimesh(mesh: Mesh | InstancedMesh) {
		const {world} = this.#context
		const {rigid, collider} = make_trimesh_rigid_and_collider(
			this.#context, mesh
		)
		return {
			rigid,
			collider,
			dispose: () => {
				world.removeCollider(collider, false)
				world.removeRigidBody(rigid)
			},
		}
	}
}

