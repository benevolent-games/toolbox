
import {NubEffectEvent} from "@benev/nubs"
import {Frequency} from "./overlord/types.js"
import {Overlord} from "./overlord/overlord.js"
import {spawn_boxes} from "./demo/spawn_boxes.js"
import {spawn_light} from "./demo/spawn_light.js"
import {Speeds} from "./trajectory/types/speeds.js"
import {BenevTheater} from "./babylon/theater/element.js"
import {make_fly_camera} from "./babylon/flycam/make_fly_camera.js"
import {contextual_behaviors_function} from "./overlord/behaviors.js"
import {add_user_pointer_movements_to_look} from "./babylon/flycam/utils/add_user_pointer_movements_to_look.js"
import {get_user_vertical_movement_based_on_keys} from "./babylon/flycam/utils/get_user_vertical_movement_based_on_keys.js"
import {get_user_move_trajectory_from_keys_and_stick} from "./babylon/flycam/utils/get_user_move_trajectory_from_keys_and_stick.js"
import {get_user_look_trajectory_from_keys_and_stick} from "./babylon/flycam/utils/get_user_look_trajectory_from_keys_and_stick.js"

const theater = document.querySelector<BenevTheater>("benev-theater")!
await theater.updateComplete

const nub_context = theater.nubContext!
const {scene, renderLoop: render_loop} = theater.babylon

spawn_boxes(scene)
spawn_light(scene, [0.11, 0.88, 0.44])

type Context = {
	nub: typeof nub_context
	theater: BenevTheater
	fly_settings: {
		speeds_for_movement: Speeds
		speeds_for_looking_with_keys_and_stick: Speeds
		look_sensitivity: {
			stick: number
			pointer: number
		}
	}
}

type State = {
	fly_camera: ReturnType<typeof make_fly_camera>
}

const cbehaviors = contextual_behaviors_function<Context, State>({
	nub: nub_context,
	theater,
	fly_settings: {
		speeds_for_movement: {
			slow: 1 / 25,
			base: 1 / 5,
			fast: 1,
		},
		speeds_for_looking_with_keys_and_stick: {
			slow: 1 / 200,
			base: 1 / 25,
			fast: 1 / 5,
		},
		look_sensitivity: {
			stick: 1 / 100,
			pointer: 1 / 200,
		},
	},
})

export const behaviors_for_examples = cbehaviors(context => behavior => [

	behavior("user can move the fly camera with key inputs")
		.selector("fly_camera")
		.activity(Frequency.High, state => {
			state.fly_camera.add_move(
				get_user_move_trajectory_from_keys_and_stick(
					context.nub,
					context.fly_settings.speeds_for_movement,
				)
			)
		}),

	behavior("user can vertically move the fly camera with key inputs")
		.selector("fly_camera")
		.activity(Frequency.High, state => {
			state.fly_camera.add_move_vertical(
				get_user_vertical_movement_based_on_keys(
					context.nub,
					context.fly_settings.speeds_for_movement,
				)
			)
		}),

	behavior("user can aim the fly camera with key and stick inputs")
		.selector("fly_camera")
		.activity(Frequency.High, state => {
			state.fly_camera.add_look(
				get_user_look_trajectory_from_keys_and_stick(
					context.nub,
					context.fly_settings.speeds_for_looking_with_keys_and_stick,
					context.fly_settings.look_sensitivity.stick,
				)
			)
		}),

	behavior("user can aim the fly camera with pointer input")
		.selector("fly_camera")
		.lifecycle({
			create: (state) => ({
				dispose_pointer_listening: NubEffectEvent
					.target(context.nub)
					.listen(add_user_pointer_movements_to_look({
						effect: "look",
						cause_to_use_when_pointer_not_locked: "Lookpad",
						sensitivity: context.fly_settings.look_sensitivity.pointer,
						add_look: state.fly_camera.add_look,
						is_pointer_locked: () => !!document.pointerLockElement,
					}))
			}),
			delete: (state, local) => local.dispose_pointer_listening(),
		}),
])

const overlord = new Overlord<State>({
	behaviors: behaviors_for_examples,
	frequencies: {
		high: 0,
		medium: 1000 / 20,
		low: 1000,
	},
})

overlord.entities.add(
	{
		fly_camera: make_fly_camera({
			scene,
			position: [0, 5, 0],
		}),
	},
	state => state.fly_camera.dispose(),
)

render_loop.add(() => overlord.tick())

theater.babylon.start()
