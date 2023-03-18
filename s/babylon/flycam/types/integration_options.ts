
import {NubContext} from "@benev/nubs"
import {V2} from "../../../utils/v2.js"
import {Speeds} from "../../../trajectory/types/speeds.js"

export type IntegrationOptions = {
	nub_context: NubContext
	render_loop: Set<() => void>
	speeds: Speeds

	look_sensitivity: {
		stick: number
		pointer: number
	}

	fly: {
		add_look: (vector: V2) => void
		add_move: (force: V2) => void
		dispose: () => void
	}
}
