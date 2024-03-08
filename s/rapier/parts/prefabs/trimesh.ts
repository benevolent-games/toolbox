
import {VertexData} from "@babylonjs/core/Meshes/mesh.vertexData.js"
import {InstancedMesh} from "@babylonjs/core/Meshes/instancedMesh.js"

import {Rapier} from "../../rapier.js"
import {prefab} from "../utils/prefab.js"
import {Grouping} from "../../parts/grouping.js"
import {Meshoid} from "../../../babyloid/types.js"
import {Trashcan} from "../../../tools/trashcan.js"
import {transform_vertex_data} from "../utils/transform_vertex_data.js"
import { applyTransform } from "../utils/apply-transform.js"
import { babylonian } from "../../../math/babylonian.js"
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder.js"
import { label } from "../../../tools/label.js"

// export const trimesh = prefab(physics => {

// 	return (o: {
// 		meshoid: Meshoid
// 		groups?: number
// 	}) => {}
// })

export const trimesh = prefab(physics => (o: {
		meshoid: Meshoid
		groups?: number
	}) => {

	console.log("trimesh", o)

	const {bag, dispose} = new Trashcan()

	const source = o.meshoid instanceof InstancedMesh
		? o.meshoid.sourceMesh
		: o.meshoid

	const data = VertexData.ExtractFromMesh(source)
	const {positions, indices} = transform_vertex_data(data, o.meshoid)

	const rigid = bag(
		physics.world.createRigidBody(
			Rapier.RigidBodyDesc.fixed()
		)
	).dump(r => physics.world.removeRigidBody(r))

	const collider = bag(
		physics.world.createCollider(
			Rapier.ColliderDesc.trimesh(positions, indices),
			rigid,
		)
	).dump(c => physics.world.removeCollider(c, false))

	const position = babylonian.to.vec3(o.meshoid.absolutePosition)
	const rotation = babylonian.ascertain.absoluteQuat(o.meshoid)

	collider.setCollisionGroups(o.groups ?? Grouping.default)
	// applyTransform(collider, {
	// 	position,
	// 	rotation,
	// })

	// const mesh = MeshBuilder.CreateIcoSphere(label("trimeshbox"), {radius: 2, subdivisions: 1})
	// mesh.material = physics.colors.magenta
	// mesh.position = o.meshoid.absolutePosition
	// if (o.meshoid.rotationQuaternion)
	// 	mesh.rotationQuaternion = o.meshoid.rotationQuaternion

	return {
		rigid,
		collider,
		dispose,
	}
})

