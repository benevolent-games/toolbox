
import {obtool} from "@chasemoskal/magical"

export type Timeline = ReturnType<typeof setupTimeline>
export type Gametime = ReturnType<Timeline["makeGametime"]>

export interface DurationSpecification {
	second: number
	minute: number
	hour: number
	day: number
	week: number
	season: number
	year: number
}

export type Duration = ReturnType<typeof setupDuration>

export const setupDuration = (spec: DurationSpecification) => ({
	seconds(x: number) { return spec.second * x },
	minutes(x: number) { return spec.minute * x },
	hours(x: number) { return spec.hour * x },
	days(x: number) { return spec.day * x },
	weeks(x: number) { return spec.week * x },
	seasons(x: number) { return spec.season * x },
	years(x: number) { return spec.year * x },
})

export function setupTimeline(spec: DurationSpecification) {
	let totalElapsedGameTime = 0
	const duration = setupDuration(spec)

	return {
		duration,
		makeGametime(delta: number) {
			totalElapsedGameTime += delta

			return {
				duration,
				get time() { return totalElapsedGameTime },
				get delta() { return delta },
				in: obtool(duration).map(fun => (x: number) => delta / fun(x)),
			}
		},
	}
}
