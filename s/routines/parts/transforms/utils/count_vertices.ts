
import {Mesh} from "@gltf-transform/core"

export function count_vertices(mesh: Mesh) {
	let vertices = 0

	for (const primitive of mesh.listPrimitives()) {
		const position = primitive.getAttribute('POSITION')!
		vertices += position.getCount()
	}

	return vertices
}

