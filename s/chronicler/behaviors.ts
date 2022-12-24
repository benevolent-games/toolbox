
import {Traits} from "./traits.js"
import {biological} from "./behaviors/biological.js"
import {SetupBehaviors} from "../ecs/types/setup-behaviors.js"

export const behaviors: SetupBehaviors<Traits> = behavior => [

	...biological(behavior),

	behavior({
		name: "homeless people claim or build homes",
		needs: ["identity"],
		action({identity}, {id, write, select}) {
			const shelters = select(["shelter"])
			const home = shelters
				.find(([,c]) => c.shelter.residents.includes(id))
			if (!home) {
				const vacancies = shelters
					.filter(([,c]) => c.shelter.residents.length)
			}
		},
	}),
]
