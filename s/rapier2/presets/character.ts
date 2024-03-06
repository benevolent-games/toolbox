
import {Rapier} from "../rapier.js"
import {Physics} from "../physics.js"
import * as Pairs from "../pairs/capsule.js"
import {PhysicsBond} from "../parts/bond.js"
import {Preset, PresetParams} from "../parts/preset.js"

export interface CharacterParams extends PresetParams {}

export class Character extends Preset {
	bond: PhysicsBond
	pair: Pairs.Capsule
	rigid: Rapier.RigidBody
	controller: Rapier.KinematicCharacterController

	constructor(
			public physics: Physics,
			o: CharacterParams & Pairs.CapsuleParams,
		) {

		super()
		const capsule = new Pairs.Capsule(physics, o)
		const rigid = this.physics.world.createRigidBody(
			Rapier.RigidBodyDesc.kinematicPositionBased()
		)

		const controller = this.physics.world.createCharacterController(o.offset)
		controller.setSlideEnabled(true)
		controller.setApplyImpulsesToDynamicBodies(true)
		controller.setMaxSlopeClimbAngle(o.slopes.maxClimbAngle)
		controller.setMinSlopeSlideAngle(o.slopes.minSlideAngle)
		if (o.autostep)
			controller.enableAutostep(
				o.autostep.maxHeight,
				o.autostep.minWidth,
				o.autostep.includeDynamicBodies,
			)
		if (o.snapToGround)
			controller.enableSnapToGround(o.snapToGround.distance)

		const bond = this.physics.bonding.bond(rigid, capsule.mimic)

		this.bond = bond
		this.rigid = rigid
		this.pair = capsule
		this.controller = controller
	}

	dispose() {
		this.bond.dispose()
		this.pair.dispose()
		this.physics.world.removeRigidBody(this.rigid)
		this.physics.world.removeCharacterController(this.controller)
	}
}

