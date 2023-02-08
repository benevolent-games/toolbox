
import {Color3, Vector3} from "@babylonjs/core/Maths/math.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"
import {PBRMaterial} from "@babylonjs/core/Materials/PBR/pbrMaterial.js"
import {DirectionalLight} from "@babylonjs/core/Lights/directionalLight.js"

import {V3, v3} from "./utils/v3.js"
import {range} from "./utils/range.js"
import {r, seed} from "./utils/randomly.js"
import {BenevTheater} from "./babylon/theater/element.js"
import {makeSpectatorCamera} from "./babylon/camera/spectator-camera.js"

const theater = document.querySelector<BenevTheater>("benev-theater")!
console.log("theater", theater)

const {
	nubContext,
	babylon: {engine, scene, renderLoop},
} = theater

if (!nubContext)
	throw new Error("nub context not found")

const ground = MeshBuilder.CreateGround("ground", {
	width: 10,
	height: 10,
	subdivisions: 4,
}, scene)


const material = new PBRMaterial("material", scene)
material.albedoColor = new Color3(0.8, 0.8, 0.8)
material.roughness = 0.5
material.metallic = 0.5

ground.material = material

function makeBox(position: V3) {
	const box = MeshBuilder.CreateBox("box", {size: 2}, scene)
	box.material = material
	box.position = v3.toBabylon(position)
}

const randomly = r(seed(4))

function rand() {
	return randomly.between(-10, 10)
}

for (const i of range(50)) {
	makeBox([rand(), rand(), rand()])
}

const direction = new Vector3(0.3, -0.8, 0.4)

const light = new DirectionalLight(
	"light",
	Vector3.Normalize(direction),
	scene,
)

light.position = v3.toBabylon(
	v3.multiplyBy(
		v3.negate(v3.fromBabylon(direction)),
		10,
	)
)

// const cam = (() => {
// 	const alpha = 0
// 	const beta = 0
// 	const radius = 15
// 	const target = Vector3.Zero()
// 	return new ArcRotateCamera("cam", alpha, beta, radius, target, scene)
// })()

const cam = makeSpectatorCamera({
	engine,
	scene,
	nubContext,
	renderLoop,
	walk: 0.2,
	lookSensitivity: {
		stick: 1 / 50,
		mouse: 1 / 1000,
	},
})

theater.babylon.start()
