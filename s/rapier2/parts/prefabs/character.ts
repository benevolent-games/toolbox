
import {Bond} from "../utils/bond.js"
import {Rapier} from "../../rapier.js"
import {prefab} from "../utils/prefab.js"
import {Trashcan} from "../../../tools/trashcan.js"
import {CapsuleVesselParams, make_capsule_vessel} from "../vessels/capsule.js"

export interface CharacterParams {}

export const character = prefab(physics => (o: CharacterParams & CapsuleVesselParams) => {
	const {bag, dispose} = new Trashcan()

	const capsule = bag(make_capsule_vessel(physics, o))
		.dump(v => v.dispose())

	const rigid = bag(
		physics.world.createRigidBody(
			Rapier.RigidBodyDesc.kinematicPositionBased()
		)
	).dump(r => physics.world.removeRigidBody(r))

	const controller = bag((() => {
		const c = physics.world.createCharacterController(o.offset)
		c.setSlideEnabled(true)
		c.setApplyImpulsesToDynamicBodies(true)
		c.setMaxSlopeClimbAngle(o.slopes.maxClimbAngle)
		c.setMinSlopeSlideAngle(o.slopes.minSlideAngle)
		if (o.autostep)
			c.enableAutostep(
				o.autostep.maxHeight,
				o.autostep.minWidth,
				o.autostep.includeDynamicBodies,
			)
		if (o.snapToGround)
			c.enableSnapToGround(o.snapToGround.distance)
		return c
	})()).dump(c => physics.world.removeCharacterController(c))

	const bond = bag(physics.bonding.add(new Bond(rigid, capsule.mimic)))
		.dump(b => physics.bonding.remove(b))

	return {
		bond,
		rigid,
		capsule,
		controller,
		dispose,
	}
})

