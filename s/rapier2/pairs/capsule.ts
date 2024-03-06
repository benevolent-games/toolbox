
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"

import {Rapier} from "../rapier.js"
import {Physics} from "../physics.js"
import {label} from "../../tools/label.js"
import {Pair, PairParams} from "../parts/pair.js"
import {babylonian} from "../../math/babylonian.js"

export interface CapsuleParams extends PairParams {

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

export class Capsule extends Pair {
	mimic: Mesh
	collider: Rapier.Collider

	constructor(
			physics: Physics,
			o: CapsuleParams,
		) {

		super(physics)

		this.collider = this.physics.world.createCollider(
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

		const mimic = this.mimic = MeshBuilder.CreateCapsule(
			label("capsule"),
			{radius: o.radius, height: 2 * (o.halfHeight + o.radius)},
			this.physics.scene,
		)
		mimic.material = o.material
		mimic.position = babylonian.from.vec3(o.position)
		mimic.rotationQuaternion = babylonian.from.quat(o.rotation)
	}
}

