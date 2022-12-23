
import {Components} from "./components.js"
import {SetupBehaviors} from "../ecs/types/setup-behaviors.js"

export const behaviors: SetupBehaviors<Components> = behavior => [

	// behavior({
	// 	name: "homeless people claim homes",
	// 	needs: ["home"],
	// 	action({home, identity}, {write, query}) {
	// 		if (!home.structureId) {
	// 			const structures = query(c => !!c.structure)
	// 			const vacant = structures
	// 				.filter(([structureId, {structure}]) => {
	// 					const occupants = query(c => c?.home?.structureId === structureId)
	// 					return occupants.length < structure!.capacity
	// 				})
	// 		}
	// 	},
	// }),

	behavior({
		name: "thirst and hunger lowers heartrate",
		needs: ["biology", "mortality"],
		action: ({biology, mortality}) => {
			const heartIsBeating = mortality.heartrate > 0
			const dyingOfThirst = biology.hydration <= 0
			const dyingOfHunger = biology.nourishment <= 0
			if (heartIsBeating && (dyingOfThirst || dyingOfHunger))
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
		action: ({mortality, death}, controls) => {
			if (!death) {
				for (const [condition, cause] of [
						[mortality.blood <= 0, "blood loss"],
						[mortality.heartrate <= 0, "cardiac arrest"],
					] as const) {
					if (condition)
						return controls.write({
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
