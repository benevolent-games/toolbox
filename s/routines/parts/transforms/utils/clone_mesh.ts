
import {Document, Mesh} from "@gltf-transform/core"

export function clone_mesh(
		document: Document,
		mesh: Mesh,
		name: string,
	) {

	return document
		.createMesh(name)
		.copy(mesh, ref => ref.clone())
		.setName(name)
}

