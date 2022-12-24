
import {Traits} from "../traits.js"
import {archetype} from "../utils/archetype.js"

export const berrybush = archetype<Traits>()(({randomly}) => () => ({

	exploitable: {
		food: 0.5,
	},

}))
