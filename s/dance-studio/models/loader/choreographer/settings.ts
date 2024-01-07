
import {ChoreoSettings} from "./types.js"

export const default_choreo_settings = (): ChoreoSettings => ({
	sensitivity: 1 / 100,
	ambulation_delay: 20,
	swivel: {
		readjustment_margin: 2 / 10,
		midpoint: 0.5,
		duration: 20, // counted in update ticks
	},
})

export function calculate_swivel_speed({swivel}: ChoreoSettings) {
	return (swivel.midpoint - swivel.readjustment_margin) / swivel.duration
}

export function calculate_ambulation_speed({ambulation_delay}: ChoreoSettings) {
	return 1 / ambulation_delay
}

