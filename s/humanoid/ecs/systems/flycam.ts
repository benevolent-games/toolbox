
import {house} from "../house.js"
import {make_fly_camera} from "../../../common/models/flycam/make_fly_camera.js"

export const flycamSystem = house.rezzer(["flycam"], ({realm}) => entity => {
	const {scene} = realm.plate
	const {position} = entity.flycam
	const fly = make_fly_camera({scene, position})

	return {
		update(_entity) {},
		dispose() {
			fly.dispose()
		},
	}
})

