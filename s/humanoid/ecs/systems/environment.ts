
import {house} from "../house.js"
import {InstancedMesh} from "@babylonjs/core/Meshes/instancedMesh.js"

export const environmentSystem = house.rezzer("environment")(({realm}) => ({environment}) => {

	const container = (() => {
		switch (environment.name) {
			case "gym":
				return realm.containers.gym
			default:
				return null
		}
	})()

	if (!container) {
		console.error(`unknown environment name "${environment.name}"`)
		return {
			update() {},
			dispose() {},
		}
	}

	const instanced = container.instantiateModelsToScene()
	const disposables = new Set<() => void>()

	for (const root of instanced.rootNodes) {
		const meshes = root
			.getChildMeshes()
			.filter(m => m instanceof InstancedMesh) as InstancedMesh[]
			// .filter(m => (m instanceof Mesh) || (m instanceof InstancedMesh)) as (Mesh | InstancedMesh)[]

		for (const mesh of meshes) {
			const meshId = realm.meshStore.keep(mesh)
			const entityId = house.entities.create({
				physical: "fixed",
				mesh: meshId,
			})
			disposables.add(() => {
				realm.meshStore.forget(meshId)
				house.entities.delete(entityId)
			})
			// const body = realm.physics.trimesh(mesh)
			// disposables.add(() => body.dispose())
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
})

