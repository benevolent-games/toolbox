
import {Nub, NubActionEvent, NubContext, NubEditor, NubStick} from "@benev/nubs"

import {Scene} from "@babylonjs/core/scene.js"
import {Engine} from "@babylonjs/core/Engines/engine.js"
import {Vector3} from "@babylonjs/core/Maths/math.vector.js"
import {Quaternion} from "@babylonjs/core/Maths/math.vector.js"
import {TargetCamera} from "@babylonjs/core/Cameras/targetCamera.js"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"

import {walker} from "./walker.js"
import {V2, v2} from "../../utils/v2.js"
import {cap} from "../../utils/numpty.js"

export function makeSpectatorCamera({
		walk, scene, engine, nubContext, renderLoop, lookSensitivity
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
	}) {

	const sprint = walk * 2

	const transformA = new TransformNode("camA", scene)
	const transformB = new TransformNode("camB", scene)
	const camera = (() => {
		const name = "spectator camera"
		const position = new Vector3(0, 0, 0)
		return new TargetCamera(name, position, scene)
	})()

	camera.ignoreParentScaling = true
	camera.parent = transformB
	transformB.parent = transformA

	let currentLook = v2.zero()
	function lookAdd(vector: V2) {
		const radian = Math.PI / 2
		currentLook = v2.add(currentLook, vector)
		currentLook[1] = cap(currentLook[1], -radian, radian)
	}

	function addMouseforce(mouseforce: V2, mouseSensitivity: number) {
		lookAdd(v2.multiplyBy(mouseforce, mouseSensitivity))
	}

	function rotateCamera(vectors: V2, mouseSensitivity: number) {
		addMouseforce(vectors, mouseSensitivity)
		const [x, y] = currentLook
		transformB.rotationQuaternion = Quaternion.RotationYawPitchRoll(
			0, -y, 0,
		)
		transformA.rotationQuaternion = Quaternion.RotationYawPitchRoll(
			x, 0, 0
		)
	}

	function moveCam(vector: V2) {
		const [x, z] = vector
		const translation = new Vector3(x, 0, z)
		const newPosition = translation.applyRotationQuaternion(
			transformB.absoluteRotationQuaternion
		)
		transformA.position.addInPlace(newPosition)
	}

	NubActionEvent
		.target(nubContext)
		.listen(event => {
			if (event.detail.type === Nub.Type.Mouse) {
				const [x, y] = event.detail.movement
				const vector: V2 = [x, -y]
				if(document.pointerLockElement)
					rotateCamera(vector, lookSensitivity.mouse)
			}
		})

	nubContext.addEventListener("pointerdown", (event: MouseEvent) => {
		const target = event.target
		if (target instanceof HTMLElement) {
			const notAlreadyPointerLocked = !document.pointerLockElement

			const notWithinStick =
				!(target instanceof NubStick) &&
				!target.closest("nub-stick")

			const notWithinEditor =
				!(target instanceof NubEditor) &&
				!target.closest("nub-bindings-editor")

			if (notAlreadyPointerLocked && notWithinStick && notWithinEditor)
				engine.enterPointerlock()
		}
	})

	renderLoop.add(() => {
		const moveVector = nubContext.actions.vector2.move?.vector
		const lookVector = nubContext.actions.vector2.look?.vector

		if (lookVector)
			rotateCamera(lookVector, lookSensitivity.stick)

		const isPressed = {
			forward: !!nubContext.actions.key.forward?.pressed,
			backward: !!nubContext.actions.key.backward?.pressed,
			leftward: !!nubContext.actions.key.leftward?.pressed,
			rightward: !!nubContext.actions.key.rightward?.pressed,
		}

		const walking = walker({
			walk,
			sprint,
			isPressed,
			moveVector,
		})

		moveCam(walking.getForce())
	})
	
	return camera
}
