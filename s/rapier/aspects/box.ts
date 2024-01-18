
import {Phys} from "../types.js"
import {Rapier} from "../rapier.js"
import {quat} from "../../tools/math/quat.js"
import {vec3} from "../../tools/math/vec3.js"
import {Material} from "@babylonjs/core/Materials/material.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"

export function box_desc(context: Phys.Context, spec: Phys.BoxSpec): Phys.ActorDesc {
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
		spec: Phys.BoxSpec,
		actor: Phys.Actor,
	) {

	if (spec.position)
		actor.rigid.setTranslation(vec3.to.xyz(spec.position), true)

	if (spec.rotation)
		actor.rigid.setRotation(quat.to.xyzw(spec.rotation), true)
}

export function create_babylon_mesh_for_box(
		{label, scene}: Phys.Context,
		spec: Phys.BoxSpec,
		actor: Phys.Actor,
		material: Material,
	) {

	const [width, height, depth] = spec.scale

	const mesh = MeshBuilder.CreateBox(
		label("physics_visual_box"),
		{width, height, depth},
		scene,
	)

	mesh.position = actor.position
	mesh.rotationQuaternion = actor.rotation
	mesh.material = material

	return mesh
}

