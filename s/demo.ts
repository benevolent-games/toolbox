
import {State} from "./demo/types/state.js"
import {Overlord} from "./overlord/overlord.js"
import {spawn_boxes} from "./demo/spawn_boxes.js"
import {spawn_light} from "./demo/spawn_light.js"
import * as patterns from "./demo/entity_patterns.js"
import {demo_behaviors} from "./demo/demo_behaviors.js"
import {BenevTheater} from "./babylon/theater/element.js"
import {fly_camera_control_settings} from "./demo/fly_camera_control_settings.js"

const theater = document.querySelector<BenevTheater>("benev-theater")!
await theater.updateComplete

const {scene} = theater.babylon
spawn_boxes(scene)
spawn_light(scene, [0.11, 0.88, 0.44])

const overlord = new Overlord<State>({
	behaviors: demo_behaviors({
		theater,
		nub: theater.nubContext!,
		fly_camera_control_settings,
	}),
	frequencies: {
		high: 0,
		medium: 1000 / 20,
		low: 1000,
	},
})

overlord.entities.add(...patterns.flycam({scene, position: [0, 5, 0]}))

theater.babylon.renderLoop.add(() => overlord.tick())
theater.babylon.start()
