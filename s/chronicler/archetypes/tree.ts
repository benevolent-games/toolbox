
import {Traits} from "../traits.js"
import {archetype} from "../utils/archetype.js"

export const tree = archetype<Traits>()(({randomly}) => () => ({

	exploitable: {
		wood: 11 + Math.floor(randomly.random() * 10),
	},

	structure: {
		integrity: 1,
		strength: 0.8,
	},

	choppable: {
		integrity: 1,
	},

}))
