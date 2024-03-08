
import {Material} from "@babylonjs/core/Materials/material.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"

import {Rapier} from "../../rapier.js"
import {prefab} from "../utils/prefab.js"
import {Vec3} from "../../../math/vec3.js"
import {vec3} from "../../../math/exports.js"
import {label} from "../../../tools/label.js"
import {Trashcan} from "../../../tools/trashcan.js"
import { applyMaterial } from "../utils/apply_material.js"

export const fixture = prefab(physics => (o: {
		position: Vec3
		material: Material | null
		radius?: number
		subdivisions?: number
	}) => {

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
	mimic.position.set(...o.position)
	rigid.setTranslation(vec3.to.xyz(o.position), true)

	return {rigid, mimic, dispose}
})

