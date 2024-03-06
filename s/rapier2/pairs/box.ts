
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"

import {Rapier} from "../rapier.js"
import {Physics} from "../physics.js"
import {label} from "../../tools/label.js"
import {Grouping} from "../parts/grouping.js"
import {Vec3, vec3} from "../../math/exports.js"
import {Pair, PairParams} from "../parts/pair.js"

export interface BoxParams extends PairParams {
	scale: Vec3
	density?: number
}

export class Box extends Pair {
	mimic: Mesh
	collider: Rapier.Collider

	constructor(
			physics: Physics,
			o: BoxParams,
		) {

		super(physics)

		const {world, scene} = this.physics
		const [width, height, depth] = o.scale

		const mimic = this.mimic = MeshBuilder.CreateBox(
			label("box"),
			{width, height, depth},
			scene,
		)

		if (o.material)
			mimic.material = o.material
		else
			mimic.visibility = 0

		this.collider = world.createCollider(
			Rapier.ColliderDesc
				.cuboid(...vec3.divideBy(o.scale, 2))
				.setDensity(o.density ?? 1)
				.setContactForceEventThreshold(o.contact_force_threshold ?? 0)
				.setCollisionGroups(o.groups ?? Grouping.default)
				.setActiveEvents(
					Rapier.ActiveEvents.COLLISION_EVENTS |
					Rapier.ActiveEvents.CONTACT_FORCE_EVENTS
				)
		)
	}
}

