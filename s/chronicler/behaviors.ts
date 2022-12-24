
import {Components} from "./components.js"
import {SetupBehaviors} from "../ecs/types/setup-behaviors.js"

export const behaviors: SetupBehaviors<Components> = behavior => [

	behavior({
		name: "homeless people claim or build homes",
		needs: ["identity"],
		action({identity}, {id, write, select}) {
			const shelters = select(["shelter"])
			const home = shelters
				.find(([,c]) => c.shelter.residents.includes(id))
			if (!home) {
				const vacancies = shelters
			}
		},
	}),

	behavior({
		name: "thirst",
		needs: ["biology"],
		action({biology}) {
			biology.hydration -= 0.001
		},
	}),

	behavior({
		name: "hunger",
		needs: ["biology"],
		action({biology}) {
			biology.nourishment -= 0.001
		},
	}),

	behavior({
		name: "extreme thirst or hunger lowers heartrate",
		needs: ["biology", "mortality"],
		action: ({biology, mortality}) => {
			const heartIsBeating = mortality.heartrate > 0
			const extremeThirst = biology.hydration <= 0
			const extremeHunger = biology.nourishment <= 0
			if (heartIsBeating && (extremeThirst || extremeHunger))
				mortality.heartrate -= 0.001
		},
	}),

	behavior({
		name: "bleeding",
		needs: ["mortality"],
		action: ({mortality}) => {
			mortality.blood -= mortality.bleed
			mortality.bleed = mortality.bleed <= 0
				? 0
				: mortality.bleed - 0.001
		},
	}),

	behavior({
		name: "death",
		needs: ["mortality"],
		action: ({mortality, death}, {id, write}) => {
			if (!death) {
				for (const [condition, cause] of [
						[mortality.blood <= 0, "blood loss"],
						[mortality.heartrate <= 0, "cardiac arrest"],
					] as const) {
					if (condition)
						return write(id, {
							death: {cause},
							mortality: undefined,
							biology: undefined,
							mood: undefined,
							personality: undefined,
							alignment: undefined,
						})
				}
			}
		},
	}),

]
