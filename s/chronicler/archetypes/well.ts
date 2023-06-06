
import {Traits} from "../traits.js"
import {archetype} from "../utils/archetype.js"

export const well = archetype<Traits>()(({randy}) =>
		({}: {position: [number, number, number]}) => ({

	location: {
		position: [0, 0, 0],
	},

	unlimited: {
		water: true,
	},

	structure: {
		integrity: 1,
		strength: 0.8,
	},

}))
