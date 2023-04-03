
import {NubEffectEvent} from "@benev/nubs"

import {State} from "./types/state.js"
import {Context} from "./types/context.js"
import {Frequency} from "../overlord/types.js"
import {behaviors} from "../overlord/behaviors.js"
import {add_user_pointer_movements_to_look} from "../babylon/flycam/utils/add_user_pointer_movements_to_look.js"
import {get_user_vertical_movement_based_on_keys} from "../babylon/flycam/utils/get_user_vertical_movement_based_on_keys.js"
import {get_user_look_trajectory_from_keys_and_stick} from "../babylon/flycam/utils/get_user_look_trajectory_from_keys_and_stick.js"
import {get_user_move_trajectory_from_keys_and_stick} from "../babylon/flycam/utils/get_user_move_trajectory_from_keys_and_stick.js"

export const demo_behaviors = (context: Context) =>
	behaviors<State>(behavior => ([

	behavior("user can move the fly camera with key inputs")
		.selector("fly_camera")
		.activity(Frequency.High, ({state}) => {
			state.fly_camera.add_move(
				get_user_move_trajectory_from_keys_and_stick(
					context.nub,
					context.fly_camera_control_settings.speeds_for_movement,
				)
			)
		}),

	behavior("user can vertically move the fly camera with key inputs")
		.selector("fly_camera")
		.activity(Frequency.High, ({state}) => {
			state.fly_camera.add_move_vertical(
				get_user_vertical_movement_based_on_keys(
					context.nub,
					context.fly_camera_control_settings.speeds_for_movement,
				)
			)
		}),

	behavior("user can aim the fly camera with key and stick inputs")
		.selector("fly_camera")
		.activity(Frequency.High, ({state}) => {
			state.fly_camera.add_look(
				get_user_look_trajectory_from_keys_and_stick(
					context.nub,
					context.fly_camera_control_settings.speeds_for_looking_with_keys_and_stick,
					context.fly_camera_control_settings.look_sensitivity.stick,
				)
			)
		}),

	behavior("user can aim the fly camera with pointer input")
		.selector("fly_camera")
		.lifecycle({
			create: ({state}) => ({
				dispose_pointer_listening: NubEffectEvent
					.target(context.nub)
					.listen(add_user_pointer_movements_to_look({
						...context.fly_camera_control_settings.pointer,
						sensitivity: context.fly_camera_control_settings.look_sensitivity.pointer,
						add_look: state.fly_camera.add_look,
						is_pointer_locked: () => !!document.pointerLockElement,
					}))
			}),
			delete: ({local}) => {
				local.dispose_pointer_listening()
			},
		}),
]))
