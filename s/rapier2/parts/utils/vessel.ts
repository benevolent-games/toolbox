
import {Material} from "@babylonjs/core/Materials/material.js"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"

import {Actor} from "./actor.js"
import {Rapier} from "../../rapier.js"
import {Quat, Vec3} from "../../../math/exports.js"

export interface VesselParams {
	position: Vec3
	rotation: Quat
	groups: number
	material: null | Material
	contact_force_threshold: number
}

export class Vessel<A extends Actor = any, M extends TransformNode = any> {
	constructor(
		public readonly world: Rapier.World,
		public readonly actor: A,
		public readonly mimic: M,
	) {}

	dispose() {
		this.mimic.dispose()
		if (this.actor instanceof Rapier.Collider)
			this.world.removeCollider(this.actor, false)
		else
			this.world.removeRigidBody(this.actor)
	}
}

