
// import {generate_id} from "@benev/slate"
// import {Scene} from "@babylonjs/core/scene.js"
// import {Color3, Quaternion} from "@babylonjs/core/Maths/math.js"
// import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"
// import {TargetCamera} from "@babylonjs/core/Cameras/targetCamera.js"
// import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"
// import {PBRMaterial} from "@babylonjs/core/Materials/PBR/pbrMaterial.js"

// import {house} from "../house.js"
// import {vec2} from "../../../tools/math/vec2.js"
// import {labeler} from "../../../tools/labeler.js"
// import {scalar} from "../../../tools/math/scalar.js"
// import {Vec3, vec3} from "../../../tools/math/vec3.js"
// import {babylonian} from "../../../tools/math/babylonian.js"

// export const humanoidSystem = house.rezzer([
// 		"humanoid",
// 		"debug",
// 		"position",
// 		"rotation",
// 		"sensitivity",
// 		"gimbal",
// 		"speeds",
// 		"intent",
// 		"choreography",
// 	], ({realm}) => (state) => {

// 	const {stage, colors} = realm
// 	const {scene} = stage
// 	const label = labeler("humanoid")
// 	const {radius} = state.humanoid
// 	const halfHeight = (state.humanoid.height - (2 * radius)) / 2

// 	const capsule = realm.physics.character({
// 		density: 1,
// 		radius: state.humanoid.radius,
// 		halfHeight,
// 		snapToGround: {
// 			distance: halfHeight / 2,
// 		},
// 		autostep: {
// 			maxHeight: halfHeight,
// 			minWidth: state.humanoid.radius,
// 			includeDynamicBodies: false,
// 		},
// 		slopes: {
// 			minSlideAngle: scalar.radians.from.degrees(75),
// 			maxClimbAngle: scalar.radians.from.degrees(46),
// 		},
// 	})

// 	const transform = new TransformNode(label("transform"), scene)
// 	transform.position = capsule.position

// 	const torusDiameter = state.humanoid.height - 0.3
// 	const torus = MeshBuilder.CreateTorus(label("torus"), {
// 		diameter: state.humanoid.height - 0.3,
// 		thickness: 0.1,
// 		tessellation: 48,
// 	}, scene)
// 	torus.material = colors.red
// 	torus.rotationQuaternion = Quaternion.RotationAlphaBetaGamma(
// 		0,
// 		0,
// 		scalar.radians.from.degrees(90),
// 	)

// 	const headbox = MeshBuilder.CreateBox(
// 		label("box"),
// 		{size: 0.2},
// 		scene,
// 	)
// 	const third_person_cam = new TargetCamera(
// 		label("third_person_cam"),
// 		babylonian.from.vec3([0, 0, -4]),
// 		scene,
// 	)
// 	third_person_cam.setTarget(headbox.position)
// 	stage.rendering.setCamera(third_person_cam)
// 	headbox.position.y = torusDiameter / 2
// 	headbox.material = colors.green

// 	const torusRoot = new TransformNode(label("torusRoot"), scene)

// 	// parenting
// 	third_person_cam.parent = headbox
// 	headbox.setParent(torusRoot)
// 	torus.setParent(torusRoot)
// 	torusRoot.setParent(transform)

// 	// initialize capsule position
// 	capsule.rigid.setTranslation(vec3.to.xyz(state.position), true)

// 	const debug = !!state.debug
// 	capsule.mesh.setEnabled(debug)
// 	torus.setEnabled(debug)
// 	headbox.setEnabled(debug)

// 	console.log(capsule)

// 	return {
// 		update(state) {

// 			// run physical movement
// 			{
// 				const [x, z] = vec2.rotate(
// 					state.intent.amble,
// 					-scalar.map(state.gimbal[0], [0, 2 * Math.PI]),
// 				)
// 				transform.rotationQuaternion = Quaternion.FromEulerAngles(
// 					0, scalar.radians.from.circle(state.gimbal[0]), 0,
// 				)
// 				capsule.applyMovement(vec3.divideBy([x, 0, z], 10))

// 				state.position = babylonian.to.vec3(capsule.position)
// 				state.rotation = babylonian.to.quat(transform.rotationQuaternion)
// 			}

// 			const a = state.gimbal[1]
// 			// const b = scalar.map(a, [0.1, 0.7])
// 			const b = scalar.spline.quickLinear(a, [0.1, 0.5, 0.7])
// 			torusRoot.rotationQuaternion = Quaternion.FromEulerAngles(
// 				(Math.PI / 2) + (Math.PI * -b),
// 				0,
// 				0,
// 			)
// 		},
// 		dispose() {
// 			// if (realm.plate.camera === camera)
// 			// 	realm.plate.setCamera()
// 			// camera.dispose()
// 		},
// 	}
// })

// export function debugMaterial({scene, color}: {
// 		scene: Scene
// 		color: Vec3
// 	}) {
// 	const m = new PBRMaterial(`vismaterial-${generate_id()}`, scene)
// 	m.albedoColor = new Color3(...color)
// 	m.metallic = 0
// 	m.roughness = 1
// 	m.alpha = 0.2
// 	return m
// }

