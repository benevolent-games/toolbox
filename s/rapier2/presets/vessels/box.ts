
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"

import {Rapier} from "../../rapier.js"
import {Physics} from "../../physics.js"
import {label} from "../../../tools/label.js"
import {Grouping} from "../../parts/grouping.js"
import {Vec3, vec3} from "../../../math/exports.js"
import {Vessel, VesselParams} from "../utils/vessel.js"

export interface BoxVesselParams extends VesselParams {
	scale: Vec3
	density?: number
}

export function make_box_vessel(physics: Physics, o: BoxVesselParams) {
	const {world, scene} = physics
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

	return new Vessel(physics, collider, mimic)
}

