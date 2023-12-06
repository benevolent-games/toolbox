
import {hut} from "./archetypes/hut.js"
import {tree} from "./archetypes/tree.js"
import {well} from "./archetypes/well.js"
import {person} from "./archetypes/person.js"
import {berrybush} from "./archetypes/berrybush.js"
import {ArchetypeOptions} from "./types/archetype-options.js"

export const archetypes = (o: ArchetypeOptions) => ({
	hut: hut(o),
	tree: tree(o),
	well: well(o),
	person: person(o),
	berrybush: berrybush(o),
})
