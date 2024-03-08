
import {prefab} from "../utils/prefab.js"
import {Transform} from "../utils/types.js"
import {Trashcan} from "../../../tools/trashcan.js"
import {applyMaterial} from "../utils/apply-material.js"
import {applyTransform} from "../utils/apply-transform.js"
import {CuboidParams, make_cuboid_collider_and_mimic} from "../utils/cuboid_collider.js"

export const box_collider = prefab(physics => (o: {
		ccd: boolean
		linearDamping: number
		angularDamping: number
	} & Transform & CuboidParams) => {

	const {bag, dispose} = new Trashcan()

	const {mesh, collider} = bag(
		make_cuboid_collider_and_mimic(physics, o)
	).dump(x => x.dispose())

	applyMaterial(mesh, o.material)
	applyTransform(collider, o)

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

