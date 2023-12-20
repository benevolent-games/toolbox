
import {house} from "../house.js"

export const environmentSystem = house.rezzer(["environment"], ({realm}) => ({environment}) => {

	const container = environment.name in realm.containers
		? realm.containers[environment.name]
		: null

	if (container) {
		const instanced = container.instantiateModelsToScene()
		return {
			update() {},
			dispose() {
				instanced.dispose()
			},
		}
	}
	else {
		console.error(`unknown environment name "${environment.name}" (realm container not found)`)
		return {
			update() {},
			dispose() {},
		}
	}
})

