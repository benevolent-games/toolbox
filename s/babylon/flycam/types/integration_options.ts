
import {NubContext} from "@benev/nubs"
import {make_fly_camera} from "../make_fly_camera.js"
import {Speeds} from "../../../trajectory/types/speeds.js"

export type IntegrationOptions = {
	nub_context: NubContext
	render_loop: Set<() => void>

	look_key_speeds: Speeds
	move_stick_and_key_speeds: Speeds

	look_sensitivity: {
		stick: number
		pointer: number
	}

	fly: ReturnType<typeof make_fly_camera>
}
