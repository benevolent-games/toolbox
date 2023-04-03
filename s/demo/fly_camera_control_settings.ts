
import {FlyCameraControlSettings} from "./types/fly_camera_control_settings.js"

export const fly_camera_control_settings: FlyCameraControlSettings = {
	pointer: {
		effect: "look",
		cause_to_use_when_pointer_not_locked: "Lookpad",
	},
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
}
