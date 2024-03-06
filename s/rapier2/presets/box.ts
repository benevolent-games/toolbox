
import {Rapier} from "../rapier.js"
import {Physics} from "../physics.js"
import * as Pairs from "../pairs/pairs.js"
import {PhysicsBond} from "../parts/bond.js"
import {Preset, PresetParams} from "../parts/preset.js"

export interface BoxParams extends PresetParams {
	linearDamping: number
	angularDamping: number
}

export class Box extends Preset {
	pair: Pairs.Box
	bond: PhysicsBond
	rigid: Rapier.RigidBody

	constructor(
			public physics: Physics,
			o: BoxParams & Pairs.BoxParams,
		) {

		super()
		const pair = new Pairs.Box(physics, o)
		const rigid = this.physics.world.createRigidBody(
			Rapier.RigidBodyDesc
				.dynamic()
				.setCcdEnabled(o.ccd)
				.setLinearDamping(o.linearDamping)
				.setAngularDamping(o.angularDamping)
		)

		const bond = this.physics.bonding.bond(rigid, pair.mimic)

		this.bond = bond
		this.pair = pair
		this.rigid = rigid
	}

	dispose() {
		this.bond.dispose()
		this.pair.dispose()
		this.physics.world.removeRigidBody(this.rigid)
	}
}

