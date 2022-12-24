
import {World} from "./traits/world.js"
import {Common} from "./traits/common.js"
import {Creature} from "./traits/creature.js"
import {Personal} from "./traits/personal.js"
import {Structural} from "./traits/structural.js"
import {Interactive} from "./traits/interactive.js"

export type Traits =
	& World
	& Common
	& Personal
	& Creature
	& Structural
	& Interactive
