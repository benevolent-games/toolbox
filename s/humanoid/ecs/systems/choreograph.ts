
import {TransformNode} from "@babylonjs/core"

import {house} from "../house.js"
import {babylonian} from "../../../tools/math/babylonian.js"
import {Choreographer} from "../../../dance-studio/models/loader/choreographer/choreographer.js"

export const choreographSystem = house.rezzer([
		"humanoid",
		"position",
		"rotation",
		"gimbal",
		"intent",
		"choreography",
	], ({realm}) => (state, id) => {

	const transform = new TransformNode(`transform::${id}`, realm.stage.scene)
	const characterInstance = realm.containers.character
		.instance([0, -(state.humanoid.height / 2), 0])

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
			state.gimbal = gimbal
			state.choreography = choreography
		},
		dispose() {},
	}
})

