
import {generate_id} from "@benev/slate"
import {Scene} from "@babylonjs/core/scene.js"
import {Color3, Quaternion} from "@babylonjs/core/Maths/math.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"
import {TargetCamera} from "@babylonjs/core/Cameras/targetCamera.js"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"
import {PBRMaterial} from "@babylonjs/core/Materials/PBR/pbrMaterial.js"
import {PhysicsAggregate} from "@babylonjs/core/Physics/v2/physicsAggregate.js"
import {PhysicsMotionType, PhysicsShapeType} from "@babylonjs/core/Physics/v2/IPhysicsEnginePlugin.js"

import {house} from "../house.js"
import {vec2} from "../../../tools/math/vec2.js"
import {Vec3, vec3} from "../../../tools/math/vec3.js"
import {scalar} from "../../../tools/math/scalar.js"
import {babylonian} from "../../../tools/math/babylonian.js"
import {Choreographer} from "../../../dance-studio/models/loader/choreographer/choreographer.js"

export const humanoidSystem = house.rezzer([
		"humanoid",
		"position",
		"sensitivity",
		"gimbal",
		"speeds",
		"intent",
		"choreography",
	], ({realm}) => (components, id) => {

	const {humanoid} = components

	const {impulse, plate} = realm
	const {scene} = plate
	const name = (n: string) => `${n}::${id}`

	const colors = {
		red: debugMaterial({scene, color: [1, .2, .2]}),
		blue: debugMaterial({scene, color: [.2, .2, 1]}),
		cyan: debugMaterial({scene, color: [.2, 1, 1]}),
		green: debugMaterial({scene, color: [.2, 1, .2]}),
	}

	const capsule = MeshBuilder.CreateCapsule(
		name("capsule"),
		{radius: humanoid.radius, height: humanoid.height},
		plate.scene,
	)

	capsule.material = colors.cyan

	const aggregate = new PhysicsAggregate(
		capsule,
		PhysicsShapeType.CAPSULE,
		{
			mass: humanoid.mass,
			restitution: 0,
			friction: 1 / 100,
		},
		plate.scene,
	)
	aggregate.body.setMotionType(PhysicsMotionType.DYNAMIC)
	const {body} = aggregate
	body.setMassProperties({
		inertia: babylonian.from.vec3([0, 0, 0]),
	})

	const torusDiameter = humanoid.height - 0.3
	const torus = MeshBuilder.CreateTorus(name("torus"), {
		diameter: humanoid.height - 0.3,
		thickness: 0.1,
		tessellation: 48,
	}, scene)
	torus.material = colors.red
	torus.rotationQuaternion = Quaternion.RotationAlphaBetaGamma(
		0,
		0,
		scalar.radians(90),
	)

	const headbox = MeshBuilder.CreateBox(
		name("box"),
		{size: 0.2},
		scene,
	)
	const third_person_cam = new TargetCamera(
		name("third_person_cam"),
		babylonian.from.vec3([0, 0, -4]),
		scene,
	)
	third_person_cam.setTarget(headbox.position)
	realm.plate.setCamera(third_person_cam)
	headbox.position.y = torusDiameter / 2
	headbox.material = colors.green

	const characterInstance = realm.containers.character.instance([0, -(humanoid.height / 2), 0])
	const choreographer = new Choreographer(characterInstance)

	const torusRoot = new TransformNode(name("torusRoot"), scene)

	// parenting
	third_person_cam.parent = headbox
	headbox.setParent(torusRoot)
	torus.setParent(torusRoot)
	torusRoot.setParent(capsule)
	characterInstance.root.setParent(capsule)
	// characterInstance.root.parent = capsule

	console.log(capsule, characterInstance)

	// const camera = new TargetCamera(name("camera"), Vector3.Zero())

	// camera.ignoreParentScaling = true
	// // camera.parent = transformB

	// realm.plate.setCamera(camera)

	// function apply_movement_while_considering_gimbal_rotation(
	// 		position: Vec3,
	// 		move: Vec2,
	// 	) {

	// 	const [x, z] = move
	// 	const translation = new Vector3(x, 0, z)

	// 	const translation_considering_rotation = translation
	// 		.applyRotationQuaternion(transformB.absoluteRotationQuaternion)

	// 	return vec3.add(
	// 		position,
	// 		babylonian.to.vec3(translation_considering_rotation),
	// 	)
	// }

	return {
		update(state) {
			let look_y_change = 0

			if (impulse.report.humanoid.buttons.test_comma)
				look_y_change = -1

			if (impulse.report.humanoid.buttons.test_period)
				look_y_change = 1

			// update the intent
			{
				let x = 0
				let y = 0

				const {
					forward,
					backward,
					leftward,
					rightward,
				} = impulse.report.humanoid.buttons

				if (forward)
					y += 1

				if (backward)
					y -= 1

				if (leftward)
					x -= 1

				if (rightward)
					x += 1

				components.intent.amble = vec2.normalize([x, y])
				components.intent.glance = [0, look_y_change]
			}

			// run physical movement
			{
				const [x, z] = vec2.rotate(
					components.intent.amble,
					scalar.map(components.gimbal[0], [0, 2 * Math.PI]),
				)
				body.applyImpulse(
					babylonian.from.vec3(vec3.multiplyBy([x, 0, z], 100)),
					capsule.absolutePosition,
				)
			}

			// run the choreographer
			{
				const {intent, gimbal, ...choreography} = choreographer.update({
					...components.choreography,
					intent: components.intent,
					gimbal: components.gimbal,
				})
				components.gimbal = gimbal
				components.choreography = choreography
			}

			const a = components.gimbal[1]
			// const b = scalar.map(a, [0.1, 0.7])
			const b = scalar.spline.quickLinear(a, [0.1, 0.5, 0.7])
			const toroidal = (Math.PI / 2) + (Math.PI * -b)
			torusRoot.rotationQuaternion = Quaternion.RotationAlphaBetaGamma(
				0,
				toroidal,
				0,
			)

			// state.humanoid.gimbal = add_to_look_vector_but_cap_vertical_axis(
			// 	state.spectator.gimbal,
			// 	vec2.multiplyBy(look, 5 / 100),
			// )

			// state.spectator.position = (
			// 	apply_movement_while_considering_gimbal_rotation(
			// 		state.spectator.position,
			// 		vec2.multiplyBy(move, 10 / 100),
			// 	)
			// )

			// const {gimbal} = state.spectator

			// transformA.position.set(...state.spectator.position)
			// transformB.rotationQuaternion = (
			// 	Quaternion
			// 		.RotationYawPitchRoll(0, -gimbal[1], 0)
			// )
			// transformA.rotationQuaternion = (
			// 	Quaternion
			// 		.RotationYawPitchRoll(gimbal[0], 0, 0)
			// )
		},
		dispose() {
			// if (realm.plate.camera === camera)
			// 	realm.plate.setCamera()
			// camera.dispose()
		},
	}
})

export function debugMaterial({scene, color}: {
		scene: Scene
		color: Vec3
	}) {
	const m = new PBRMaterial(`vismaterial-${generate_id()}`, scene)
	m.albedoColor = new Color3(...color)
	m.metallic = 0
	m.roughness = 1
	m.alpha = 0.2
	return m
}

