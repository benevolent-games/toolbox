
import {spawn_boxes} from "./demo/spawn_boxes.js"
import {spawn_light} from "./demo/spawn_light.js"
import {BenevTheater} from "./babylon/theater/element.js"
import {make_fly_camera} from "./babylon/camera/make_fly_camera.js"
import {integrate_nubs_to_control_fly_camera} from "./babylon/camera/spectator-camera.js"

const theater = document.querySelector<BenevTheater>("benev-theater")!
console.log("theater", theater)

const {
	nubContext,
	babylon: {scene, renderLoop},
} = theater

if (!nubContext)
	throw new Error("nub context not found")

spawn_boxes(scene)
spawn_light(scene, [0.11, 0.88, 0.44])

integrate_nubs_to_control_fly_camera({
	nub_context: nubContext,
	render_loop: renderLoop,
	fly: make_fly_camera({scene, position: [0, 5, 0]}),
	look_sensitivity: {
		stick: 1 / 50,
		pointer: 1 / 500,
	},
	speeds: {
		mosey: 0.3,
		walk: 1,
		sprint: 3,
	},
})

theater.babylon.start()
