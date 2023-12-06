
import {Traits} from "../traits.js"
import {SetupBehaviors} from "../../ecs/types/setup-behaviors.js"

export const productivity: SetupBehaviors<Traits> = behavior => [

	behavior({
		name: "",
		needs: ["identity"],
		frequency: duration => duration.seconds(1),
		action({identity}, {id, write, select}) {},
	})

]
