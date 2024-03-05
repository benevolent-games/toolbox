
import {Scene} from "@babylonjs/core/scene.js"
import {Material} from "@babylonjs/core/Materials/material.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"

import {Rapier} from "../rapier.js"
import {Grouping} from "./grouping.js"
import {label} from "../../tools/label.js"
import {Quat, vec3, Vec3} from "../../math/exports.js"

export type BoxColliderParams = {
	scale: Vec3
	groups?: number
	position?: Vec3
	rotation?: Quat
	density?: number
	material?: Material
	contact_force_threshold?: number
}

export class PhysicsColliders {
	constructor(
		public readonly world: Rapier.World,
		public readonly scene: Scene,
	) {}

	box(o: BoxColliderParams) {
		const {world, scene} = this
		const [width, height, depth] = o.scale

		const mimic = MeshBuilder.CreateBox(
			label("box"),
			{width, height, depth},
			scene,
		)

		if (o.material)
			mimic.material = o.material
		else
			mimic.visibility = 0

		const collider = world.createCollider(
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

		return {collider, mimic}
	}
}

