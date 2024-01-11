
import {rezzer} from "../house.js"
import {Vector3} from "@babylonjs/core/Maths/math.vector.js"
import {HemisphericLight} from "@babylonjs/core/Lights/hemisphericLight.js"

export const lighting_system = rezzer(
		"light", "direction", "intensity"
	)(realm => (init, id) => {
	const {scene} = realm.stage

	const light = new HemisphericLight(
		`hemi_${id}`,
		Vector3.FromArray(init.direction),
		scene,
	)

	light.intensity = init.intensity
	light.direction.set(...init.direction)

	return {
		update(state) {
			light.intensity = state.intensity
			light.direction.set(...state.direction)
		},
		dispose() {
			light.dispose()
		},
	}
})

