
import {Material} from "@babylonjs/core/Materials/material.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"

import {Rapier} from "../../rapier.js"
import {prefab} from "../utils/prefab.js"
import {Transform} from "../utils/types.js"
import {label} from "../../../tools/label.js"
import {Trashcan} from "../../../tools/trashcan.js"
import {Vec3, vec3} from "../../../math/exports.js"
import {applyMaterial} from "../utils/apply-material.js"
import {applyTransform} from "../utils/apply-transform.js"

export const box = prefab(physics => (o: {
		scale: Vec3
		ccd: boolean
		groups: number
		density: number
		linearDamping: number
		angularDamping: number
		material: Material | null
		contact_force_threshold: number
	} & Transform) => {

	const {bag, dispose} = new Trashcan()
	const [width, height, depth] = o.scale

	const mesh = bag(
		MeshBuilder.CreateBox(
			label("box"),
			{width, height, depth},
			physics.scene,
		)
	).dump(m => m.dispose())

	const collider = bag(
		physics.world.createCollider(
			Rapier.ColliderDesc
				.cuboid(...vec3.divideBy(o.scale, 2))
				.setDensity(o.density ?? 1)
				.setContactForceEventThreshold(o.contact_force_threshold ?? 0)
				.setCollisionGroups(o.groups)
				.setActiveEvents(
					Rapier.ActiveEvents.COLLISION_EVENTS |
					Rapier.ActiveEvents.CONTACT_FORCE_EVENTS
				)
		)
	).dump(c => physics.world.removeCollider(c, false))

	const rigid = bag(physics.world.createRigidBody(
		Rapier.RigidBodyDesc
			.dynamic()
			.setCcdEnabled(o.ccd)
			.setLinearDamping(o.linearDamping)
			.setAngularDamping(o.angularDamping)
	)).dump(r => physics.world.removeRigidBody(r))

	applyMaterial(mesh, o.material)
	applyTransform(rigid, o)

	const bond = bag(physics.bonding.create(rigid, mesh))
		.dump(b => physics.bonding.remove(b))

	return {
		bond,
		mesh,
		rigid,
		dispose,
		collider,
	}
})

