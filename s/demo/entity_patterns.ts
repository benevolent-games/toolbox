
import {V3} from "../utils/v3.js"
import {State} from "./types/state.js"
import {Scene} from "@babylonjs/core/scene.js"
import {EntityPattern} from "../overlord/types.js"
import {make_fly_camera} from "../babylon/flycam/make_fly_camera.js"

export const flycam = ({scene, position}: {
		scene: Scene
		position: V3
	}): EntityPattern<State> => [
	{
		fly_camera: make_fly_camera({
			scene,
			position,
		})
	},
	state => state.fly_camera.dispose(),
]
