
import {NubContext} from "@benev/nubs"
import {make_fly_camera} from "../make_fly_camera.js"
import {Speeds} from "../../../trajectory/types/speeds.js"

export type IntegrationOptions = {
	fly: ReturnType<typeof make_fly_camera>
	nub_context: NubContext
	render_loop: Set<() => void>

	speeds_for_movement: Speeds
	speeds_for_looking_with_keys_and_stick: Speeds

	look_sensitivity: {
		stick: number
		pointer: number
	}
}
