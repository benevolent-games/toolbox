
import {Rapier} from "../../rapier.js"
import {prefab} from "../utils/prefab.js"
import {Trashcan} from "../../../tools/trashcan.js"
import {BoxVesselParams, make_box_vessel} from "../vessels/box.js"

export interface BoxParams {
	ccd: boolean
	linearDamping: number
	angularDamping: number
}

export const box = prefab(physics => (o: BoxParams & BoxVesselParams) => {
	const {bag, dispose} = new Trashcan()

	const vessel = bag(make_box_vessel(physics, o))
		.dump(v => v.dispose())

	const rigid = bag(physics.world.createRigidBody(
		Rapier.RigidBodyDesc
			.dynamic()
			.setCcdEnabled(o.ccd)
			.setLinearDamping(o.linearDamping)
			.setAngularDamping(o.angularDamping)
	)).dump(r => physics.world.removeRigidBody(r))

	const bond = bag(physics.bonding.bond(rigid, vessel.mimic))
		.dump(b => b.dispose())

	return {
		vessel,
		rigid,
		bond,
		dispose,
	}
})

