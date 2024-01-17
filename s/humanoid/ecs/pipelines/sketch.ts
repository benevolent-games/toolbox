
import {mainthread} from "../hub.js"
import {force_system} from "../systems/force.js"
import {lighting_system} from "../systems/hemi.js"
import {freelook_system} from "../systems/freelook.js"
import {humanoid_system} from "../systems/humanoid.js"
import {intention_system} from "../systems/intention.js"
import {spectator_system} from "../systems/spectator.js"
import {environment_system} from "../systems/environment.js"
import {choreography_system} from "../systems/choreography.js"
import {velocity_calculator_system} from "../systems/velocity_calculator.js"
import {physics_dynamic_system, physics_fixed_system} from "../systems/physics.js"

export const mainpipe = mainthread.presystems(
	intention_system,
	force_system,
	freelook_system,
	environment_system,
	lighting_system,
	physics_fixed_system,
	physics_dynamic_system,
	spectator_system,
	humanoid_system,
	velocity_calculator_system,
	choreography_system,
)

