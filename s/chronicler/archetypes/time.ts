
import {Traits} from "../traits.js"
import {archetype} from "../utils/archetype.js"

export const time = archetype<Traits>()(({randomly}) => () => ({

	time: {
		clock: 0,
	},

}))
