
import {maptool} from "@benev/slate"
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {VertexData} from "@babylonjs/core/Meshes/mesh.vertexData.js"
import {InstancedMesh} from "@babylonjs/core/Meshes/instancedMesh.js"

import {Rapier} from "../rapier.js"
import {prefab} from "../utils/prefab.js"
import {Meshoid} from "../../tools/babyloid.js"
import {Trashcan} from "../../tools/trashcan.js"
import {transform_vertex_data} from "../utils/transform-vertex-data.js"

export const trimesh = prefab(physics => {
	const cache = new Map<Mesh, VertexData>()

	return (o: {groups: number, meshoid: Meshoid}) => {
		const trashcan = new Trashcan()

		const source = o.meshoid instanceof InstancedMesh
			? o.meshoid.sourceMesh
			: o.meshoid

		const vertexData = maptool(cache)
			.guarantee(source, () => VertexData.ExtractFromMesh(source))

		const {positions, indices} = transform_vertex_data(vertexData, o.meshoid)

		const rigid = trashcan.bag(
			physics.world.createRigidBody(
				Rapier.RigidBodyDesc.fixed()
			)
		).dump(r => physics.world.removeRigidBody(r))

		const collider = trashcan.bag(
			physics.world.createCollider(
				Rapier.ColliderDesc.trimesh(positions, indices),
				rigid,
			)
		).dump(c => physics.world.removeCollider(c, false))

		collider.setCollisionGroups(o.groups)

		return {
			rigid,
			collider,
			meshoid: o.meshoid,
			dispose: trashcan.dispose,
		}
	}
})

