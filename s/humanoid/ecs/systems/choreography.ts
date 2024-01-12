
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"

import {rezzer} from "../house.js"
import {babylonian} from "../../../tools/math/babylonian.js"
import {Choreographer} from "../../../dance-studio/models/loader/choreographer/choreographer.js"

export const choreography_system = rezzer(
		"humanoid",
		"height",
		"position",
		"rotation",
		"gimbal",
		"intent",
		"choreography",
	)(realm => (state, id) => {

	const disposables = new Set<() => void>()

	const transform = new TransformNode(`transform::${id}`, realm.stage.scene)
	disposables.add(() => transform.dispose())

	const characterInstance = realm.containers.character
		.instance([0, -(state.height / 2), 0])
	disposables.add(() => characterInstance.dispose())

	characterInstance.root.setParent(transform)

	const position
		= transform.position
		= babylonian.from.vec3(state.position)

	const rotation
		= transform.rotationQuaternion
		= babylonian.from.quat(state.rotation)

	const choreographer = new Choreographer(characterInstance)

	return {
		update(state) {
			position.set(...state.position)
			rotation.set(...state.rotation)

			// run the choreographer
			const {intent, gimbal, ...choreography} = choreographer.update({
				...state.choreography,
				intent: state.intent,
				gimbal: state.gimbal,
			})
			// state.gimbal = gimbal
			state.choreography = choreography
		},
		dispose() {
			for (const dispose of disposables)
				dispose()
		},
	}
})

