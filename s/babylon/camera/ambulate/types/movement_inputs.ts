
import {V2} from "../../../../utils/v2.js"

export type MovementInputs = {

	speeds: {
		mosey: number
		walk: number
		sprint: number
	}

	keys: {
		forward: boolean
		backward: boolean
		leftward: boolean
		rightward: boolean

		mosey: boolean
		sprint: boolean
	}

	stick: V2
}
