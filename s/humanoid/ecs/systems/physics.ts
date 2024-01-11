
import {house} from "../house.js"
import {babylonian} from "../../../tools/math/babylonian.js"

export const physicsSystem = house.system(({realm}) => {

	const boxes = house
		.selection("physical", "position", "rotation", "scale", "density")
		.lifecycle(state => {

			const box = realm.physics.box({
				scale: state.scale,
				density: state.density,
				position: state.position,
				rotation: state.rotation,
			})

			return {
				update(state) {
					state.position = babylonian.to.vec3(box.mesh.position)
					state.rotation = babylonian.to.quat(box.mesh.absoluteRotationQuaternion)
				},
				dispose() {
					box.dispose()
				},
			}
		})

	return tick => {
		boxes.tick(tick)
	}
})

