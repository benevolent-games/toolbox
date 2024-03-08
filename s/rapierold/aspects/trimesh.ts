
import {VertexData} from "@babylonjs/core/Meshes/mesh.vertexData.js"
import {InstancedMesh} from "@babylonjs/core/Meshes/instancedMesh.js"

import {Phys} from "../types.js"
import {Rapier} from "../rapier.js"
import {Meshoid} from "../../babyloid/types.js"
import {default_groups} from "../parts/groups.js"
import {transform_vertex_data} from "../parts/transform_vertex_data.js"

export type TrimeshSpec = {
	meshoid: Meshoid
	groups?: number
}

export function make_trimesh_rigid_and_collider(
		{world}: Phys.Context,
		{meshoid, groups}: TrimeshSpec,
	) {

	const source = meshoid instanceof InstancedMesh
		? meshoid.sourceMesh
		: meshoid

	const data = VertexData.ExtractFromMesh(source)
	const {positions, indices} = transform_vertex_data(data, meshoid)

	const rigid = world.createRigidBody(
		Rapier.RigidBodyDesc.fixed()
	)

	const collider = world.createCollider(
		Rapier.ColliderDesc.trimesh(positions, indices),
		rigid,
	)

	collider.setCollisionGroups(groups ?? default_groups)

	return {rigid, collider}
}

