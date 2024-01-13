
import {Rapier} from "../rapier.js"
import {Quat, quat} from "../../tools/math/quat.js"
import {Vec3, vec3} from "../../tools/math/vec3.js"
import {Material} from "@babylonjs/core/Materials/material.js"
import {PhysContext, Physical, PhysicalDesc} from "../types.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"

export interface BoxSpec {
	scale: Vec3
	density: number
	position?: Vec3
	rotation?: Quat
	material?: Material
}

export function box_desc(context: PhysContext, spec: BoxSpec): PhysicalDesc {
	return {
		rigid: Rapier.RigidBodyDesc
			.dynamic(),

		collider: Rapier.ColliderDesc
			.cuboid(...vec3.divideBy(spec.scale, 2))
			.setDensity(spec.density)
			.setContactForceEventThreshold(context.contact_force_threshold)
			.setActiveEvents(
				Rapier.ActiveEvents.COLLISION_EVENTS |
				Rapier.ActiveEvents.CONTACT_FORCE_EVENTS
			),
	}
}

export function apply_position_and_rotation(
		spec: BoxSpec,
		physical: Physical,
	) {

	if (spec.position)
		physical.rigid.setTranslation(vec3.to.xyz(spec.position), true)

	if (spec.rotation)
		physical.rigid.setRotation(quat.to.xyzw(spec.rotation), true)
}

export function create_babylon_mesh_for_box(
		{label, scene}: PhysContext,
		spec: BoxSpec,
		physical: Physical,
		material: Material,
	) {

	const [width, height, depth] = spec.scale

	const mesh = MeshBuilder.CreateBox(
		label("physics_visual_box"),
		{width, height, depth},
		scene,
	)

	mesh.position = physical.position
	mesh.rotationQuaternion = physical.rotation
	mesh.material = material

	return mesh
}

