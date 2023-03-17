
import {NubContext} from "@benev/nubs"
import {V2} from "../../../utils/v2.js"
import {MovementInputs} from "./movement_inputs.js"

export type IntegrationOptions = {
	nub_context: NubContext
	render_loop: Set<() => void>
	speeds: MovementInputs["speeds"]

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
