
import {house} from "../house.js"
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {InstancedMesh} from "@babylonjs/core/Meshes/instancedMesh.js"

export const environmentSystem = house.rezzer(["environment"], ({realm}) => ({environment}) => {
	const container = (() => {
		switch (environment.name) {
			case "gym":
				return realm.containers.gym
			default:
				return null
		}
	})()

	if (container) {
		const instanced = container.instantiateModelsToScene()
		const disposables = new Set<() => void>()

		for (const root of instanced.rootNodes) {
			const meshes = root
				.getChildMeshes()
				.filter(m => (m instanceof Mesh) || (m instanceof InstancedMesh)) as (Mesh | InstancedMesh)[]

			for (const mesh of meshes) {
				const body = realm.physics.static_trimesh(mesh)
				disposables.add(() => body.dispose())
			}
		}

		return {
			update() {},
			dispose() {
				for (const dispose of disposables)
					dispose()
				instanced.dispose()
			},
		}
	}
	else {
		console.error(`unknown environment name "${environment.name}"`)
		return {
			update() {},
			dispose() {},
		}
	}
})

