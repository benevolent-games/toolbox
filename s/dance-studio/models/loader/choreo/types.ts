
import {Vec2} from "../../../../tools/math/vec2.js"

/////////////////////
/////////////////////

export type Choreography = {
	settings: ChoreoSettings
	intent: ChoreoIntent
	gimbal: Vec2
	swivel: number
	adjustment: ChoreoSwivelAdjustment | null
	ambulatory: ChoreoAmbulatory
	rotation: number
}

/////////////////////
/////////////////////

export type ChoreoAmbulatory = {
	ambulation: Vec2
	magnitude: number
	stillness: number
	north: number
	west: number
	south: number
	east: number
}

export type ChoreoIntent = {
	amble: Vec2
	glance: Vec2
}

export type ChoreoSwivelAdjustment = {
	initial_swivel: number
	direction: "left" | "right"
	duration: number
	progress: number
}

export type ChoreoSettings = {
	sensitivity: number
	ambulation_delay: number
	swivel: {
		readjustment_margin: number
		midpoint: number
		duration: number
	}
}

/////////////////////
/////////////////////

export type AdjustmentAnims = {
	start: (adjustment: ChoreoSwivelAdjustment) => void
	stop: (adjustment: ChoreoSwivelAdjustment) => void
	update: (adjustment: ChoreoSwivelAdjustment) => void
}

