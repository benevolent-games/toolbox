
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"

import {Rapier} from "../../rapier.js"
import {prefab} from "../utils/prefab.js"
import {label} from "../../../tools/label.js"
import {Trashcan} from "../../../tools/trashcan.js"

export interface FixtureParams {
	radius: number
	subdivisions: number
}

export const fixture = prefab(physics => (o: FixtureParams) => {
	const {bag, dispose} = new Trashcan()

	const mimic = bag(
		MeshBuilder.CreateIcoSphere(
			label("fixture-sphere"),
			{radius: o.radius, subdivisions: o.subdivisions},
			physics.scene,
		)
	).dump(m => m.dispose())

	const rigid = bag(
		physics.world.createRigidBody(
			Rapier.RigidBodyDesc.fixed()
		)
	).dump(r => physics.world.removeRigidBody(r))

	return {rigid, mimic, dispose}
})

