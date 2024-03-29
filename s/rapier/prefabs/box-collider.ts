
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"

import {Rapier} from "../rapier.js"
import {Bond} from "../utils/bond.js"
import {prefab} from "../utils/prefab.js"
import {Transform} from "../utils/types.js"
import {Trashcan} from "../../tools/trashcan.js"
import {applyMaterial} from "../utils/apply-material.js"
import {applyTransform} from "../utils/apply-transform.js"
import {CuboidParams, make_cuboid_collider_and_mimic} from "../utils/cuboid-collider.js"

export type BoxCollider = {
	mesh: Mesh
	dispose: () => void
	collider: Rapier.Collider
	bond: Bond<Rapier.Collider, Mesh>
}

export const box_collider = prefab(physics => (
		o: Partial<Transform> & CuboidParams,
	): BoxCollider => {

	const {bag, dispose} = new Trashcan()

	const {mesh, collider} = bag(
		make_cuboid_collider_and_mimic(physics, {...o, parent: undefined})
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

