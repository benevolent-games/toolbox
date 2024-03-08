
import {prefab} from "../utils/prefab.js"
import {Trashcan} from "../../../tools/trashcan.js"
import {CuboidParams, make_cuboid_collider_and_mimic} from "../utils/cuboid_collider.js"

export const box_collider = prefab(physics => (o: {
		ccd: boolean
		linearDamping: number
		angularDamping: number
	} & CuboidParams) => {

	const {bag, dispose} = new Trashcan()

	const {mesh, collider} = bag(
		make_cuboid_collider_and_mimic(physics, o)
	).dump(x => x.dispose())

	const bond = bag(
		physics.bonding.create(collider, mesh)
	).dump(b => physics.bonding.remove(b))

	return {
		bond,
		mesh,
		dispose,
		collider,
	}
})

