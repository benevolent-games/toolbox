import {Context} from "./context.js"
import {Mode} from "../types/mode.js"
import {FlyCamera} from "./fly_camera.js"
import {Controllable} from "./controllable.js"
import {Frequency} from "../types/frequency.js"

export type Parts = {
	fly_camera: FlyCamera
	controllable: Controllable
}

// export const fly_camera_behaviors = (context: Context) =>
// 	behaviors<Parts>(behavior => ([

// 	behavior("user can move fly camera with key inputs")
// 		.selector("fly_camera", "controllable")
// 		.activity(Frequency.High, ({fly_camera, controllable}) => {

// 			if (context.mode === Mode.Simulate)
// 				fly_camera.add_move(
// 					get_user_move_trajectory_from_keys_and_stick(
// 						context.nub,
// 					)
// 				)
// 		}),

// ]))
