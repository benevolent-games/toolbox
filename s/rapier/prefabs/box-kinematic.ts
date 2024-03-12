
import {Rapier} from "../rapier.js"
import {prefab} from "../utils/prefab.js"
import {Transform} from "../utils/types.js"
import {Trashcan} from "../../tools/trashcan.js"
import {applyMaterial} from "../utils/apply-material.js"
import {applyTransform} from "../utils/apply-transform.js"
import {CuboidParams, make_cuboid_collider_and_mimic} from "../utils/cuboid-collider.js"

export const box_kinematic = prefab(physics => (o: {
		ccd: boolean
	} & Partial<Transform> & CuboidParams) => {

	const trash = new Trashcan()

	const rigid = trash.bag(physics.world.createRigidBody(
		Rapier.RigidBodyDesc
			.kinematicPositionBased()
			.setCcdEnabled(o.ccd)
	)).dump(r => physics.world.removeRigidBody(r))

	const {mesh, collider} = trash.bag(
		make_cuboid_collider_and_mimic(physics, {...o, parent: rigid})
	).dump(x => x.dispose())

	applyMaterial(mesh, o.material)
	applyTransform(collider, o)

	const bond = trash.bag(
		physics.bonding.create(rigid, mesh)
	).dump(b => physics.bonding.remove(b))

	return {
		bond,
		mesh,
		rigid,
		collider,
		dispose: trash.dispose,
	}
})

