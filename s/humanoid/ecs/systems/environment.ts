
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {InstancedMesh} from "@babylonjs/core/Meshes/instancedMesh.js"

import {mainthread} from "../hub.js"
import {babylonian} from "../../../tools/math/babylonian.js"
import {obtain_babylon_quaternion_from_mesh} from "../../../tools/obtain_babylon_quaternion_from_mesh.js"

export const environment_system = mainthread.lifecycle("environment")("environment")
	(realm => ({environment}) => {

	const container = (() => {
		switch (environment) {
			case "gym":
				return realm.containers.gym
			default:
				return null
		}
	})()

	if (!container) {
		console.error(`unknown environment "${environment}"`)
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
			.filter(m => (m instanceof InstancedMesh) || (m instanceof Mesh)) as (Mesh | InstancedMesh)[]

		for (const mesh of meshes) {
			const meshId = realm.meshStore.keep(mesh)
			const entityId = realm.entities.create({
				physical: "fixed",
				mesh: meshId,
				scale: babylonian.to.vec3(mesh.scaling),
				position: babylonian.to.vec3(mesh.position),
				rotation: babylonian.to.quat(
					obtain_babylon_quaternion_from_mesh(mesh)
				),
			})
			disposables.add(() => {
				realm.meshStore.forget(meshId)
				realm.entities.delete(entityId)
			})
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

