
import {Vector3} from "@babylonjs/core/Maths/math.vector.js"
import {HemisphericLight} from "@babylonjs/core/Lights/hemisphericLight.js"

import {house} from "../house.js"

export const hemiSystem = house.rezzer(["hemi"], ({realm}) => (entity, id) => {
	const {scene} = realm.stage
	const {direction, intensity} = entity.hemi

	const light = new HemisphericLight(`hemi_${id}`, Vector3.FromArray(direction), scene)
	light.intensity = intensity

	return {
		update(entity) {
			light.intensity = entity.hemi.intensity
			light.direction = Vector3.FromArray(entity.hemi.direction)
		},
		dispose() {
			light.dispose()
		},
	}
})

