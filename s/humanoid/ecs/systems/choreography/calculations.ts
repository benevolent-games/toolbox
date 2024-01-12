
import {scalar} from "../../../../tools/math/scalar.js"
import {Vec2, vec2} from "../../../../tools/math/vec2.js"
import {AdjustmentAnims, ChoreoSwivelAdjustment} from "../../../../dance-studio/models/loader/choreographer/types.js"

export type Choreography = {
	swivel: number
	settings: ChoreographySettings
	adjustment: null | ChoreoSwivelAdjustment
}

export type ChoreographySettings = {
	swivel_duration: number
	swivel_readjustment_margin: number
}

export type Ambulatory = {
	magnitude: number
	stillness: number
	north: number
	west: number
	south: number
	east: number
}

////////////////////////////////
////////////////////////////////

export const swivel_midpoint = 0.5

export function swivel_effected_by_glance(swivel: number, [x]: Vec2) {
	return scalar.clamp(swivel + (x * 2))
}

export function calculate_ambulatory_report(velocity: Vec2): Ambulatory {
	const magnitude = vec2.magnitude(velocity)
	const stillness = scalar.clamp(1 - magnitude)
	const [x, y] = velocity
	const north = scalar.clamp(y, 0, 1)
	const west = -scalar.clamp(x, -1, 0)
	const south = -scalar.clamp(y, -1, 0)
	const east = scalar.clamp(x, 0, 1)
	return {magnitude, stillness, north, west, south, east}
}

export function apply_adjustments(
		adjustment_anims: AdjustmentAnims,
		ambulatory: Ambulatory,
		choreo: Choreography,
	) {

	const {adjustment, settings} = choreo
	const character_is_ambulating = ambulatory.magnitude > 0.1

	if (adjustment) {
		const speed = 1 / adjustment.duration
		adjustment.progress += speed

		choreo.swivel = calculate_adjustment_swivel(adjustment)

		if (adjustment.progress >= 1) {
			adjustment_anims.stop(adjustment)
			choreo.adjustment = null
		}
	}
	else {
		if (character_is_ambulating) {
			const speed = calculate_swivel_speed(settings)
			const diff = swivel_midpoint - choreo.swivel

			if (Math.abs(diff) <= speed)
				choreo.swivel = swivel_midpoint
			else
				choreo.swivel += (diff < 0)
					? -speed
					: speed
		}
		else if (adjustment_is_needed(choreo.swivel, settings.swivel_readjustment_margin)) {
			choreo.adjustment = {
				duration: settings.swivel_duration,
				progress: 0,
				initial_swivel: choreo.swivel,
				direction: choreo.swivel < swivel_midpoint
					? "left"
					: "right",
			}
			adjustment_anims.start(choreo.adjustment)
		}
	}

	choreo.swivel = scalar.clamp(choreo.swivel)
}

export function adjustment_is_needed(swivel: number, margin: number) {
	return !scalar.within(
		swivel,
		margin,
		1 - margin,
	)
}

function calculate_adjustment_swivel(adjustment: ChoreoSwivelAdjustment) {
	return scalar.map(adjustment.progress, [
		adjustment.initial_swivel,
		swivel_midpoint,
	])
}

function calculate_swivel_speed({
		swivel_duration,
		swivel_readjustment_margin,
	}: Choreography["settings"]) {
	return (swivel_midpoint - swivel_readjustment_margin) / swivel_duration
}

