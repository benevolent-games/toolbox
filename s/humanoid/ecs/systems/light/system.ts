
import {Core} from "../../../../core/core.js"
import {systematize} from "../../systematize.js"
import {Vector3} from "@babylonjs/core/Maths/math.vector.js"
import {HemisphericLight} from "@babylonjs/core/Lights/hemisphericLight.js"

export const lightSystem = systematize("model", ({entities, realm}) => {
	const {plate} = realm
	const hemiMap = new Map<Core.Id, HemisphericLight>()

	return () => {

		for (const [id, {light}] of entities.select("light")) {
			if (light.type === "hemi") {
				if (!hemiMap.has(id)) {
					const hemi = new HemisphericLight(
						"hemi",
						new Vector3(...light.direction),
						plate.scene,
					)
					hemi.intensity = light.intensity
					hemiMap.set(id, hemi)
				}
			}
		}

		for (const id of [...hemiMap.keys()]) {
			if (!entities.has(id)) {
				const hemi = hemiMap.get(id)!
				hemi.dispose()
				hemiMap.delete(id)
			}
		}
	}
})

