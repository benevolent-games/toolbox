import {obtool} from "@chasemoskal/magical"

const g_second = 1000
const g_minute = g_second * 60
const g_hour = g_minute * 10
const g_day = g_hour * 6
const g_week = g_day * 7
const g_season = g_week * 2
const g_year = g_season * 4

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
