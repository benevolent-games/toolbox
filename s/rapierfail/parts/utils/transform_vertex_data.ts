
import {Vector3} from "@babylonjs/core/Maths/math.vector.js"
import {VertexData} from "@babylonjs/core/Meshes/mesh.vertexData.js"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"

export function transform_vertex_data(
		data: VertexData,
		transform: TransformNode,
	) {

	const new_positions: number[] = []
	const original_positions = new Float32Array(data.positions!)
	const matrix = transform.computeWorldMatrix(true)

	for (let i = 0; i < original_positions.length; i += 3) {
		const {x, y, z} = Vector3.TransformCoordinates(
			new Vector3(
				original_positions[i],
				original_positions[i + 1],
				original_positions[i + 2],
			),
			matrix,
		)
		new_positions.push(x, y, z)
	}

	return {
		positions: new Float32Array(new_positions),
		indices: new Uint32Array(data.indices!),
	}
}

