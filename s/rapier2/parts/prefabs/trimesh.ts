
import {VertexData} from "@babylonjs/core/Meshes/mesh.vertexData.js"
import {InstancedMesh} from "@babylonjs/core/Meshes/instancedMesh.js"

import {Rapier} from "../../rapier.js"
import {prefab} from "../utils/prefab.js"
import {Grouping} from "../../parts/grouping.js"
import {Meshoid} from "../../../babyloid/types.js"
import {Trashcan} from "../../../tools/trashcan.js"
import {transform_vertex_data} from "../utils/transform_vertex_data.js"

export const box = prefab(physics => (o: {
		meshoid: Meshoid
		groups?: number
	}) => {

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

	collider.setCollisionGroups(o.groups ?? Grouping.default)

	return {
		rigid,
		collider,
		dispose,
	}
})

