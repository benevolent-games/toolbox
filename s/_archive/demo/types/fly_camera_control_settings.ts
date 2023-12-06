
import {Speeds} from "../../trajectory/types/speeds.js"

export type FlyCameraControlSettings = {
	speeds_for_movement: Speeds
	speeds_for_looking_with_keys_and_stick: Speeds
	pointer: {
		effect: string,
		cause_to_use_when_pointer_not_locked: string,
	}
	look_sensitivity: {
		stick: number
		pointer: number
	}
}
