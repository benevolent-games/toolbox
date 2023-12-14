
import {Speeds} from "./speeds.js"
import {Cardinals} from "./cardinals.js"
import {Modifiers} from "./modifiers.js"
import {Vec2} from "../../../tools/math/vec2.js"

export type TrajectoryInputs = {
	speeds: Speeds
	stick_vector: Vec2
	cardinals: Cardinals
	modifiers: Modifiers
}
