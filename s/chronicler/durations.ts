
import {DurationSpecification} from "./utils/gametime.js"

const second = 1000
const minute = second * 60
const hour = minute * 10
const day = hour * 6
const week = day * 7
const season = week * 2
const year = season * 4

export const durationSpec: DurationSpecification = {
	second,
	minute,
	hour,
	day,
	week,
	season,
	year,
}
