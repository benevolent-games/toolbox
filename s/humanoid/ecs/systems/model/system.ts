
import {InstantiatedEntries} from "@babylonjs/core/assetContainer.js"

import {Core} from "../../../../core/core.js"
import {systematize} from "../../systematize.js"

export const modelSystem = systematize("model", ({entities, realm}) => {
	const map = new Map<Core.Id, InstantiatedEntries>()

	return () => {

		// adding model instances
		for (const [id, {model}] of entities.select("model")) {
			if (!map.has(id)) {
				const container = realm.containers[model.container]
				const instanced = container.instantiateModelsToScene()
				map.set(id, instanced)
			}
		}

		// deleting model instances
		for (const id of [...map.keys()])
			if (!entities.has(id)) {
				const instanced = map.get(id)!
				instanced.dispose()
				map.delete(id)
			}
	}
})

