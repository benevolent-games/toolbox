
import {Vector3} from "@babylonjs/core/Maths/math.js"
import {DirectionalLight} from "@babylonjs/core/Lights/directionalLight.js"

import {v3} from "./utils/v3.js"
import {spawnBoxes} from "./demo/spawn-boxes.js"
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

spawnBoxes(scene)

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

makeSpectatorCamera({
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
