
import {Phys} from "../types.js"
import {Rapier} from "../rapier.js"
import {label} from "../../tools/label.js"
import {quat, vec3} from "../../math/exports.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"

export function box_desc(
		context: Phys.Context,
		spec: Phys.BoxSpec,
	): Phys.ActorDesc {

	const rigid = Rapier.RigidBodyDesc
		.dynamic()
		.setLinearDamping(spec.linearDamping ?? 0)
		.setAngularDamping(spec.angularDamping ?? 0)

	return {
		rigid,
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
		{scene}: Phys.Context,
		spec: Phys.BoxSpec,
		actor: Phys.Actor,
	) {

	const [width, height, depth] = spec.scale

	const mesh = MeshBuilder.CreateBox(
		label("physics_visual_box"),
		{width, height, depth},
		scene,
	)

	mesh.position = actor.position
	mesh.rotationQuaternion = actor.rotation

	if (spec.material)
		mesh.material = spec.material
	else
		mesh.visibility = 0

	return mesh
}

