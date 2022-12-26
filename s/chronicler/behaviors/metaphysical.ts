
import {Traits} from "../traits.js"
import {SetupBehaviors} from "../../ecs/types/setup-behaviors.js"

export const metaphysical: SetupBehaviors<Traits> = behavior => [

	behavior({
		name: "time waits for no man",
		needs: ["time"],
		frequency: duration => 0,
		action({time}, {id, write, select}) {
			
		},
	})

]
