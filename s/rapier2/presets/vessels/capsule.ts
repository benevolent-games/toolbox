
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"

import {Rapier} from "../../rapier.js"
import {Physics} from "../../physics.js"
import {label} from "../../../tools/label.js"
import {babylonian} from "../../../math/babylonian.js"
import {Vessel, VesselParams} from "../utils/vessel.js"

export interface CapsuleVesselParams extends VesselParams {

	/** distance the capsule will hover over the ground, recommended 0.02 */
	offset: number

	mass: number
	radius: number
	halfHeight: number
	slopes: {
		maxClimbAngle: number
		minSlideAngle: number
	}
	autostep: null | {
		maxHeight: number
		minWidth: number
		includeDynamicBodies: boolean
	}
	snapToGround: null | {
		distance: number
	}
}

export function make_capsule_vessel(physics: Physics, o: CapsuleVesselParams) {
	const collider = physics.world.createCollider(
		Rapier.ColliderDesc
			.capsule(o.halfHeight, o.radius)
			.setMass(o.mass)
			.setContactForceEventThreshold(o.contact_force_threshold)
			.setCollisionGroups(o.groups)
			.setActiveEvents(
				Rapier.ActiveEvents.COLLISION_EVENTS |
				Rapier.ActiveEvents.CONTACT_FORCE_EVENTS
			)
	)

	const mimic = MeshBuilder.CreateCapsule(
		label("capsule"),
		{radius: o.radius, height: 2 * (o.halfHeight + o.radius)},
		physics.scene,
	)
	mimic.material = o.material
	mimic.position = babylonian.from.vec3(o.position)
	mimic.rotationQuaternion = babylonian.from.quat(o.rotation)

	return new Vessel(physics, collider, mimic)
}

