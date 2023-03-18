
import {Speeds} from "./speeds.js"
import {V2} from "../../utils/v2.js"
import {Cardinals} from "./cardinals.js"
import {Modifiers} from "./modifiers.js"

export type TrajectoryInputs = {
	speeds: Speeds
	stick_vector: V2
	cardinals: Cardinals
	modifiers: Modifiers
}
