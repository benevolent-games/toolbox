
import {rezzer} from "../house.js"
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {babylonian} from "../../../tools/math/babylonian.js"

export const physics_dynamic_system = rezzer(
		"physical", "shape", "position", "rotation", "scale", "density",
	)(realm => state => {

	let mesh: Mesh
	let dispose = () => {}

	switch (state.shape) {
		case "box": {
			const box = realm.physics.box({
				scale: state.scale,
				density: state.density,
				position: state.position,
				rotation: state.rotation,
			})
			mesh = box.mesh
			dispose = () => box.dispose()
		} break
		default: {
			throw new Error(`unknown shape "${state.shape}"`)
		}
	}

	return {
		dispose,
		update(state) {
			state.position = babylonian.to.vec3(mesh.position)
			state.rotation = babylonian.to.quat(mesh.absoluteRotationQuaternion)
		},
	}
})

export const physics_fixed_system = rezzer(
		"physical", "mesh", "position", "rotation", "scale",
	)(realm => state => {

	const body = realm.physics.trimesh(
		realm.meshStore.recall(state.mesh)
	)

	return {
		update() {},
		dispose() {
			body.dispose()
		},
	}
})

