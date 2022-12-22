
import {Behavior, ecs} from "../ecs.js"
import {Components} from "./components.js"
import {Randomly} from "../utils/randomly.js"

export const behaviors = (
		e: ReturnType<typeof ecs<Components>>,
		randomly: Randomly,
	): Behavior[] => [

	// e.behavior({
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

	// e.behavior({
	// 	name: "thirst and hunger lowers heartrate",
	// 	needs: ["biology", "mortality"],
	// 	action: ({biology, mortality}) => {
	// 		const heartIsBeating = mortality.heartrate > 0
	// 		const dyingOfThirst = biology.hydration <= 0
	// 		const dyingOfHunger = biology.nourishment <= 0
	// 		if (heartIsBeating && (dyingOfThirst || dyingOfHunger))
	// 			mortality.heartrate -= 0.001
	// 	},
	// }),

	e.behavior({
		name: "bleeding",
		needs: ["mortality"],
		action: ({mortality}) => {
			mortality.blood -= mortality.bleed
			mortality.bleed = mortality.bleed <= 0
				? 0
				: mortality.bleed - 0.001
		},
	}),

	e.behavior({
		name: "death",
		needs: ["mortality"],
		action: ({mortality, death}, {write}) => {
			if (!death) {
				for (const [condition, cause] of [
						[mortality.blood <= 0, "blood loss"],
						[mortality.heartrate <= 0, "cardiac arrest"],
					] as const) {
					if (condition)
						return write({
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
