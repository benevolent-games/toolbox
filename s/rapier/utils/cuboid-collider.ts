
import {Material} from "@babylonjs/core/Materials/material.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"

import {Rapier} from "../rapier.js"
import {Physics} from "../physics.js"
import {label} from "../../tools/label.js"
import {Trashcan} from "../../tools/trashcan.js"
import {Vec3, vec3} from "../../math/exports.js"
import {applyMaterial} from "../utils/apply-material.js"

export type CuboidParams = {
	scale: Vec3
	groups: number
	sensor: boolean
	density: number
	material: Material | null
	contact_force_threshold: number
}

export function make_cuboid_collider_and_mimic(
		physics: Physics,
		o: {parent: undefined | Rapier.RigidBody} & CuboidParams,
	) {

	const {bag, dispose} = new Trashcan()
	const [width, height, depth] = o.scale

	const mesh = bag(
		MeshBuilder.CreateBox(
			label("box"),
			{width, height, depth},
			physics.scene,
		)
	).dump(m => m.dispose())

	applyMaterial(mesh, o.material)

	const collider = bag(
		physics.world.createCollider(
			Rapier.ColliderDesc
				.cuboid(...vec3.divideBy(o.scale, 2))
				.setDensity(o.density)
				.setContactForceEventThreshold(o.contact_force_threshold)
				.setCollisionGroups(o.groups)
				.setSensor(o.sensor)
		)
	).dump(c => physics.world.removeCollider(c, false))

	return {mesh, collider, dispose}
}

