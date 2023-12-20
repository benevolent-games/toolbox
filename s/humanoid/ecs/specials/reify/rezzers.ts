
import {ob} from "@benev/slate"
import {Light} from "@babylonjs/core/Lights/light.js"
import {Vector3} from "@babylonjs/core/Maths/math.vector.js"
import {InstantiatedEntries} from "@babylonjs/core/assetContainer.js"
import {HemisphericLight} from "@babylonjs/core/Lights/hemisphericLight.js"

import {makeRezzer} from "./parts/make_rezzer.js"
import {Realm} from "../../../models/realm/realm.js"

export type Rezzers = ReturnType<typeof setup_rezzers>["rezzers"]

export function setup_rezzers({realm}: {
		realm: Realm
	}) {
	const fullRezzers = {

		light: makeRezzer("light")<Light>(map => ({
			add(id, {light}) {
				if (light.type === "hemi") {
					const hemi = new HemisphericLight(
						"hemi",
						new Vector3(...light.direction),
						realm.plate.scene,
					)
					hemi.intensity = light.intensity
					map.set(id, hemi)
				}
				else
					throw new Error(`unsupported light type "${light.type}"`)
			},
			update(hemi, {light}) {
				if (light.type === "hemi") {
					if (hemi instanceof HemisphericLight) {
						hemi.direction.set(...light.direction)
						hemi.intensity = light.intensity
					}
					else
						throw new Error(`cannot change light type at this time "${light.type}"`)
				}
			},
			delete(id) {
				const light = map.get(id)!
				light.dispose()
				map.delete(id)
			},
		})),

		model: makeRezzer("model")<InstantiatedEntries>(map => ({
			add(id, {model}) {
				const container = realm.containers[model.container]
				const instanced = container.instantiateModelsToScene()
				map.set(id, instanced)
			},
			update() {},
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

