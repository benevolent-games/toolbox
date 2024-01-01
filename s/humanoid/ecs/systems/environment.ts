
import {house} from "../house.js"
import {PhysicsAggregate} from "@babylonjs/core/Physics/v2/physicsAggregate.js"
import {PhysicsMotionType, PhysicsShapeType} from "@babylonjs/core/Physics/v2/IPhysicsEnginePlugin.js"

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
		for (const root of instanced.rootNodes) {
			for (const mesh of root.getChildMeshes()) {
				const aggregate = new PhysicsAggregate(
					mesh,
					PhysicsShapeType.MESH,
					{mass: 0},
					realm.plate.scene,
				)
				aggregate.body.setMotionType(PhysicsMotionType.STATIC)
				console.log("added mesh physics", mesh.name)
			}
		}
		return {
			update() {},
			dispose() {
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

