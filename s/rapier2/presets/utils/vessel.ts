
import {Material} from "@babylonjs/core/Materials/material.js"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"

import {Rapier} from "../../rapier.js"
import {Physics} from "../../physics.js"
import {Quat, Vec3} from "../../../math/exports.js"

export interface VesselParams {
	position: Vec3
	rotation: Quat
	groups: number
	material: null | Material
	contact_force_threshold: number
}

export class Vessel<T extends TransformNode> {
	constructor(
		public readonly physics: Physics,
		public readonly collider: Rapier.Collider,
		public readonly mimic: T,
	) {}

	dispose() {
		this.mimic.dispose()
		this.physics.world.removeCollider(this.collider, false)
	}
}

