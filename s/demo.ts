
import {spawn_boxes} from "./demo/spawn_boxes.js"
import {spawn_light} from "./demo/spawn_light.js"
import {BenevTheater} from "./babylon/theater/element.js"
import {make_fly_camera} from "./babylon/flycam/make_fly_camera.js"
import {integrate_nubs_to_control_fly_camera} from "./babylon/flycam/integrate_nubs_to_control_fly_camera.js"

const theater = document.querySelector<BenevTheater>("benev-theater")!
const nub_context = theater.nubContext!
const {scene, renderLoop: render_loop} = theater.babylon

spawn_boxes(scene)
spawn_light(scene, [0.11, 0.88, 0.44])

integrate_nubs_to_control_fly_camera({
	nub_context,
	render_loop,
	fly: make_fly_camera({scene, position: [0, 5, 0]}),

	move_stick_and_key_speeds: {
		slow: 1 / 50,
		base: 1 / 10,
		fast: 1 / 2,
	},

	look_key_speeds: {
		slow: 1 / 200,
		base: 1 / 25,
		fast: 1 / 5,
	},

	look_sensitivity: {
		stick: 1 / 50,
		pointer: 1 / 100,
	},
})

theater.babylon.start()
