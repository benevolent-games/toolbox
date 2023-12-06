
import {Traits} from "../traits.js"
import {archetype} from "../utils/archetype.js"

export const hut = archetype<Traits>()(({randy}) =>
		({capacity = 4}: {capacity?: number} = {}) => ({

	shelter: {
		capacity,
		residents: [],
	},

	structure: {
		integrity: 1,
		strength: 0.2 + (randy.random() * 0.5),
	},

	flammable: {
		fire: 0,
		fuel: 1,
		burned: 0,
	},

}))
