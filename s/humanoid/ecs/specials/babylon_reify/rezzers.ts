
import {ob} from "@benev/slate"
import {InstantiatedEntries} from "@babylonjs/core/assetContainer.js"

import {makeRezzer} from "./parts/make_rezzer.js"
import {Realm} from "../../../models/realm/realm.js"

export type Rezzers = ReturnType<typeof setup_rezzers>["rezzers"]

export function setup_rezzers({realm}: {
		realm: Realm
	}) {

	const fullRezzers = {
		models: makeRezzer("model")<InstantiatedEntries>(map => ({
			add(id, {model}) {
				const container = realm.containers[model.container]
				const instanced = container.instantiateModelsToScene()
				map.set(id, instanced)
			},
			delete(id) {
				const instanced = map.get(id)!
				instanced.dispose()
				map.delete(id)
			},
		})),
	}

	return {
		fullRezzers: Object.values(fullRezzers),
		rezzers: ob(fullRezzers).map(rezzer => rezzer.external),
	}
}

