
import {Rapier} from "../../rapier.js"
import {prefab} from "../utils/prefab.js"
import {Trashcan} from "../../../tools/trashcan.js"
import {CubeVesselParams, make_cube_vessel} from "../vessels/cube.js"

export interface BoxParams {
	ccd: boolean
	linearDamping: number
	angularDamping: number
}

export const box = prefab(physics => (o: BoxParams & CubeVesselParams) => {
	const {bag, dispose} = new Trashcan()

	const cube = bag(make_cube_vessel(physics, o))
		.dump(v => v.dispose())

	const rigid = bag(physics.world.createRigidBody(
		Rapier.RigidBodyDesc
			.dynamic()
			.setCcdEnabled(o.ccd)
			.setLinearDamping(o.linearDamping)
			.setAngularDamping(o.angularDamping)
	)).dump(r => physics.world.removeRigidBody(r))

	const bond = bag(physics.bonding.create(rigid, cube.mimic))
		.dump(b => physics.bonding.remove(b))

	return {
		bond,
		rigid,
		dispose,
	}
})

