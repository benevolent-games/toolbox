
import {Rapier} from "../rapier.js"
import {PhysicsBonding} from "./bonding.js"
import {BoxColliderParams, PhysicsColliders} from "./colliders.js"

export type BoxPresetParams = {
	ccd: boolean
	linearDamping: number
	angularDamping: number
} & BoxColliderParams

export class PhysicsPresets {
	constructor(
		public readonly world: Rapier.World,
		public readonly bonding: PhysicsBonding,
		public readonly colliders: PhysicsColliders,
	) {}

	box(o: BoxPresetParams) {
		const {collider, mimic} = this.colliders.box(o)

		const rigid = this.world.createRigidBody(
			Rapier.RigidBodyDesc
				.dynamic()
				.setCcdEnabled(o.ccd)
				.setLinearDamping(o.linearDamping)
				.setAngularDamping(o.angularDamping)
		)

		const bond = this.bonding.bond(rigid, mimic, () => {
			this.world.removeCollider(collider, false)
			this.world.removeRigidBody(rigid)
			mimic.dispose()
		})

		return {bond, rigid, collider, mimic}
	}
}

