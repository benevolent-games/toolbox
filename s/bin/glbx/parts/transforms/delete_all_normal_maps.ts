
import {Document, Texture} from "@gltf-transform/core"

export function delete_all_normal_maps() {
	return (document: Document) => {
		const root = document.getRoot()
		const normals = new Set<Texture>()

		for (const material of root.listMaterials()) {
			const texture = material.getNormalTexture()
			if (texture) {
				normals.add(texture)
				material.setNormalTexture(null)
			}
		}

		for (const texture of [...normals])
			texture.dispose()
	}
}

