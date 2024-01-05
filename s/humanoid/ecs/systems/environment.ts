
import {house} from "../house.js"
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"

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
				.filter(m => m instanceof Mesh) as Mesh[]

			for (const mesh of meshes) {
				const container = realm.physics.static_trimesh(mesh)
				disposables.add(() => container.dispose())
				console.log("added mesh physics", mesh.name)
				// const aggregate = new PhysicsAggregate(
				// 	mesh,
				// 	PhysicsShapeType.MESH,
				// 	{mass: 0, friction: 1},
				// 	realm.plate.scene,
				// )
				// aggregate.body.setMotionType(PhysicsMotionType.STATIC)
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

