
import {NubContext, NubEffectEvent} from "@benev/nubs"

import {Scene} from "@babylonjs/core/scene.js"
import {Engine} from "@babylonjs/core/Engines/engine.js"
import {Vector3} from "@babylonjs/core/Maths/math.vector.js"
import {TargetCamera} from "@babylonjs/core/Cameras/targetCamera.js"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"

import {walker} from "./walker.js"
import {v2} from "../../utils/v2.js"
import {V3} from "../../utils/v3.js"
import {lookAdd} from "./utils/look-add.js"
import {onCameraRotate} from "./utils/on-camera-rotate.js"
import {transformRotate} from "./utils/transform-rotate.js"
import {onCameraMovement} from "./utils/on-camera-movement.js"

export function makeSpectatorCamera({
		walk, scene, engine, nubContext, renderLoop, lookSensitivity: {mouse}, startPosition
	}: {
		walk: number
		scene: Scene
		engine: Engine
		nubContext: NubContext
		renderLoop: Set<() => void>
		lookSensitivity: {
			stick: number
			mouse: number
		}
		startPosition: V3
	}) {

	const sprint = walk * 2

	const transformA = new TransformNode("camA", scene)
	const transformB = new TransformNode("camB", scene)
	const camera = (() => {
		const name = "spectator camera"
		const position = new Vector3(...startPosition)
		return new TargetCamera(name, position, scene)
	})()

	camera.ignoreParentScaling = true
	camera.parent = transformB
	transformB.parent = transformA

	const state = {currentLook: v2.zero()}

	NubEffectEvent
		.target(nubContext)
		.listen(({detail}) => {
			if (detail.kind === "pointer" && detail.effect === "look") {
				if (document.pointerLockElement || detail.cause === "Lookpad")
					onCameraRotate({
						getUpdateStarters: () => ({movement: detail.movement}),
						addMouseforce: (mouseforce) => lookAdd
							(state, v2.multiplyBy(mouseforce, mouse)),
						updateCameraRotation: () => transformRotate(state.currentLook, transformA, transformB)
					})
			}
		})

	renderLoop.add(() => {

		const {getForce} = walker({
			walk,
			sprint,
			isPressed: {
				forward: !!nubContext.effects.key.forward?.pressed,
				backward: !!nubContext.effects.key.backward?.pressed,
				leftward: !!nubContext.effects.key.leftward?.pressed,
				rightward: !!nubContext.effects.key.rightward?.pressed,
			},
			moveVector: nubContext.effects.stick.move?.vector,
		})

		onCameraMovement({
			getUpdateStarters: () => ({getForce, transformB}),
			updateCameraPosition: newPosition => transformA.position.addInPlace(newPosition)
		})
	})
	
	return camera
}
