
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {InstancedMesh} from "@babylonjs/core/Meshes/instancedMesh.js"

export class MeshStore {
	#map = new Map<number, Mesh | InstancedMesh>
	#count = 0
	#nextId() {
		return this.#count++
	}

	keep(mesh: Mesh | InstancedMesh) {
		const id = this.#nextId()
		this.#map.set(id, mesh)
		return id
	}

	recall(id: number) {
		const mesh = this.#map.get(id)
		if (!mesh)
			throw new Error(`MeshStore failed to recall mesh ${id}`)
		return mesh
	}

	forget(id: number) {
		this.#map.delete(id)
	}
}

