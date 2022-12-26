
import {Traits} from "../traits.js"
import {SetupBehaviors} from "../../ecs/types/setup-behaviors.js"

export const biological: SetupBehaviors<Traits> = behavior => [

	behavior({
		name: "thirst",
		needs: ["biology"],
		frequency: duration => duration.minutes(1),
		action({biology}, {gametime}) {
			biology.hydration -= gametime.in.days(3)
		},
	}),

	behavior({
		name: "hunger",
		needs: ["biology"],
		frequency: duration => duration.minutes(1),
		action({biology}, {gametime}) {
			biology.nourishment -= gametime.in.weeks(1)
		},
	}),

	behavior({
		name: "extreme thirst or hunger lowers heartrate",
		needs: ["biology", "mortality"],
		frequency: duration => duration.minutes(1),
		action({biology, mortality}, {gametime}) {
			const heartIsBeating = mortality.heartrate > 0
			const extremeThirst = biology.hydration <= 0
			const extremeHunger = biology.nourishment <= 0
			if (heartIsBeating && (extremeThirst || extremeHunger))
				mortality.heartrate -= gametime.in.hours(1)
		},
	}),

	behavior({
		name: "bleeding",
		needs: ["mortality"],
		frequency: duration => duration.seconds(1),
		action: ({mortality}, {gametime}) => {
			mortality.blood -= mortality.bleed
			mortality.bleed = mortality.bleed <= 0
				? 0
				: mortality.bleed - gametime.in.days(1)
		},
	}),

	behavior({
		name: "death",
		needs: ["mortality"],
		frequency: duration => duration.seconds(0.5),
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
