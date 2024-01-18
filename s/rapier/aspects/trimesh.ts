
import {Phys} from "../types.js"
import {Rapier} from "../rapier.js"
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {VertexData} from "@babylonjs/core/Meshes/mesh.vertexData.js"
import {InstancedMesh} from "@babylonjs/core/Meshes/instancedMesh.js"
import {transform_vertex_data} from "../parts/transform_vertex_data.js"

export function make_trimesh_rigid_and_collider(
		{world}: Phys.Context,
		mesh: Mesh | InstancedMesh,
	) {

	const source = mesh instanceof InstancedMesh
		? mesh.sourceMesh
		: mesh

	const data = VertexData.ExtractFromMesh(source)
	const {positions, indices} = transform_vertex_data(data, mesh)

	const rigid = world.createRigidBody(
		Rapier.RigidBodyDesc.fixed()
	)

	const collider = world.createCollider(
		Rapier.ColliderDesc.trimesh(positions, indices),
		rigid,
	)

	return {rigid, collider}
}

