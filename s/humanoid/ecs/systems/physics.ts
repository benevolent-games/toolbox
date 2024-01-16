
import {mainthread} from "../hub.js"
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {babylonian} from "../../../tools/math/babylonian.js"

export const physics_dynamic_system = mainthread.lifecycle(
		"physical",
		"shape",
		"position",
		"rotation",
		"scale",
		"density",
	)(realm => init => {

	let mesh: Mesh
	let dispose = () => {}

	switch (init.shape) {
		case "box": {
			const box = realm.physics.box({
				scale: init.scale,
				density: init.density,
				position: init.position,
				rotation: init.rotation,
			})
			mesh = box.mesh
			dispose = () => box.dispose()
		} break
		default: {
			throw new Error(`unknown shape "${init.shape}"`)
		}
	}

	return {
		dispose,
		update(_tick, state) {
			state.position = babylonian.to.vec3(mesh.position)
			state.rotation = babylonian.to.quat(mesh.absoluteRotationQuaternion)
		},
	}
})

export const physics_fixed_system = mainthread.lifecycle(
		"physical",
		"mesh",
		"position",
		"rotation",
		"scale",
	)(realm => init => {

	const mesh = realm.meshStore.recall(init.mesh)
	const body = realm.physics.trimesh(mesh)

	return {
		update() {},
		dispose() {
			body.dispose()
		},
	}
})

