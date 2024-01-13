
import {Quaternion} from "@babylonjs/core/Maths/math.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"
import {TargetCamera} from "@babylonjs/core/Cameras/targetCamera.js"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"

import {rezzer} from "../house.js"
import {flatten} from "./utils/flatten.js"
import {Vec3, vec3} from "../../../tools/math/vec3.js"
import {gimbaltool} from "./utils/gimbaltool.js"
import {labeler} from "../../../tools/labeler.js"
import {scalar} from "../../../tools/math/scalar.js"
import {babylonian} from "../../../tools/math/babylonian.js"
import { molasses, molasses3d } from "./utils/molasses.js"
import { human } from "../../../tools/human.js"

export const humanoid_system = rezzer(
		"humanoid",
		"debug",
		"radius",
		"height",
		"mass",
		"smoothing",
		"position",
		"rotation",
		"sensitivity",
		"gimbal",
		"speeds",
		"force",
		"choreography",
	)(realm => init => {

	const {stage, colors} = realm
	const {scene} = stage
	const label = labeler("humanoid")
	const halfHeight = (init.height - (2 * init.radius)) / 2

	const disposables = new Set<() => void>()

	const capsule = realm.physics.character({
		mass: 70,
		radius: init.radius,
		halfHeight,
		snapToGround: {
			distance: halfHeight / 2,
		},
		autostep: {
			maxHeight: halfHeight,
			minWidth: init.radius,
			includeDynamicBodies: false,
		},
		slopes: {
			minSlideAngle: scalar.radians.from.degrees(75),
			maxClimbAngle: scalar.radians.from.degrees(46),
		},
	})

	const transform = new TransformNode(label("transform"), scene)

	const torusDiameter = init.height - 0.3
	const torus = MeshBuilder.CreateTorus(label("torus"), {
		diameter: init.height - 0.3,
		thickness: 0.1,
		tessellation: 48,
	}, scene)
	torus.material = colors.red
	torus.rotationQuaternion = Quaternion.RotationAlphaBetaGamma(
		0,
		0,
		scalar.radians.from.degrees(90),
	)

	const headbox = MeshBuilder.CreateBox(
		label("box"),
		{size: 0.2},
		scene,
	)
	const third_person_cam = new TargetCamera(
		label("third_person_cam"),
		babylonian.from.vec3([0, 0, -4]),
		scene,
	)
	third_person_cam.setTarget(headbox.position)
	stage.rendering.setCamera(third_person_cam)
	headbox.position.y = torusDiameter / 2
	headbox.material = colors.green

	const torusRoot = new TransformNode(label("torusRoot"), scene)

	// parenting
	third_person_cam.parent = headbox
	headbox.setParent(torusRoot)
	torus.setParent(torusRoot)
	torusRoot.setParent(transform)

	// initialize capsule position
	capsule.rigid.setTranslation(vec3.to.xyz(init.position), true)
	transform.position.set(...init.position)

	disposables
		.add(() => capsule.dispose())
		.add(() => third_person_cam.dispose())
		.add(() => headbox.dispose())
		.add(() => torus.dispose())
		.add(() => torusRoot.dispose())
		.add(() => transform.dispose())

	const debug = !!init.debug
	capsule.mesh.setEnabled(debug)
	torus.setEnabled(debug)
	headbox.setEnabled(debug)

	let smoothed_y = init.position[1]

	return {
		update(state) {

			// run physical movement
			{

				const [x, z] = gimbaltool(state.gimbal)
					.horizontal_rotate(flatten(state.force))

				transform.rotationQuaternion = Quaternion.FromEulerAngles(
					0, scalar.radians.from.circle(state.gimbal[0]), 0,
				)

				const hustle = vec3.multiplyBy([x, 0, z], state.speeds.base / realm.tickrate)
				capsule.applyMovement(hustle)

				smoothed_y = molasses(
					state.smoothing * 2,
					smoothed_y,
					capsule.position.y,
				)

				const smoothed_position: Vec3 = [
					capsule.position.x,
					smoothed_y,
					capsule.position.z,
				]

				state.position = smoothed_position
				state.rotation = babylonian.to.quat(transform.rotationQuaternion)

				transform.position = babylonian.from.vec3(
					molasses3d(
						state.smoothing,
						babylonian.to.vec3(transform.position),
						state.position,
					)
				)
			}

			const a = state.gimbal[1]
			const b = scalar.spline.quickLinear(a, [0.1, 0.5, 0.7])
			torusRoot.rotationQuaternion = Quaternion.FromEulerAngles(
				(Math.PI / 2) + (Math.PI * -b),
				0,
				0,
			)
		},
		dispose() {
			if (realm.stage.rendering.camera === third_person_cam)
				realm.stage.rendering.setCamera(null)

			for (const dispose of disposables)
				dispose()
		},
	}
})

