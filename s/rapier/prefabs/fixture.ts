
import {Material} from "@babylonjs/core/Materials/material.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"

import {Rapier} from "../rapier.js"
import {prefab} from "../utils/prefab.js"
import {vec3} from "../../math/exports.js"
import {label} from "../../tools/label.js"
import {Transform} from "../utils/types.js"
import {Trashcan} from "../../tools/trashcan.js"
import {applyMaterial} from "../utils/apply-material.js"

export const fixture = prefab(physics => (o: {
		material: Material | null
		radius?: number
		subdivisions?: number
	} & Partial<Transform>) => {

	const {bag, dispose} = new Trashcan()

	const mimic = bag(
		MeshBuilder.CreateIcoSphere(
			label("fixture-sphere"),
			{radius: o.radius ?? 0.2, subdivisions: o.subdivisions ?? 2},
			physics.scene,
		)
	).dump(m => m.dispose())

	const rigid = bag(
		physics.world.createRigidBody(
			Rapier.RigidBodyDesc.fixed()
		)
	).dump(r => physics.world.removeRigidBody(r))

	applyMaterial(mimic, o.material)

	const {position = vec3.zero()} = o
	mimic.position.set(...position)
	rigid.setTranslation(vec3.to.xyz(position), true)

	return {rigid, mimic, dispose}
})

