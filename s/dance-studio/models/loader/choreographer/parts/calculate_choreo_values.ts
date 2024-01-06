
import {scalar} from "../../../../../tools/math/scalar.js"
import {Vec2, vec2} from "../../../../../tools/math/vec2.js"
import {calculate_ambulation_speed, calculate_swivel_speed} from "../settings.js"
import {AdjustmentAnims, ChoreoAmbulatory, ChoreoSettings, ChoreoSwivelAdjustment, Choreography} from "../types.js"

export function calculate_choreo_values(
		original: Choreography,
		adjustment_anims: AdjustmentAnims,
	) {

	const choreo = structuredClone(original)

	choreo.gimbal = gimbal_effected_by_glance(choreo)
	choreo.swivel = swivel_effected_by_glance(choreo)
	choreo.rotation = calculate_character_rotation_in_radians(choreo)

	choreo.ambulatory = calculate_ambulatory_report(choreo)

	const {swivel, adjustment} = handle_adjustments(
		choreo,
		adjustment_anims,
	)
	choreo.swivel = swivel
	choreo.adjustment = adjustment

	return choreo
}

////////////////////////////////////////
////////////////////////////////////////

function swivel_effected_by_glance(choreo: Choreography) {
	const [x] = choreo.intent.glance
	const {swivel, settings} = choreo
	return scalar.clamp(swivel + (x * settings.sensitivity * 2))
}

function gimbal_effected_by_glance(choreo: Choreography) {
	let [glanceX, glanceY] = choreo.intent.glance
	let [x, y] = choreo.gimbal
	x = scalar.wrap(x + (glanceX * choreo.settings.sensitivity))
	y = scalar.clamp(y + (glanceY * choreo.settings.sensitivity))
	return [x, y] as Vec2
}

function calculate_ambulatory_report(choreo: Choreography): ChoreoAmbulatory {
	const ambulation = molasses2d(
		calculate_ambulation_speed(choreo.settings),
		choreo.ambulatory.ambulation,
		choreo.intent.amble,
	)
	const magnitude = vec2.magnitude(ambulation)
	const stillness = scalar.clamp(1 - magnitude)
	const [x, y] = ambulation
	const north = scalar.clamp(y, 0, 1)
	const west = -scalar.clamp(x, -1, 0)
	const south = -scalar.clamp(y, -1, 0)
	const east = scalar.clamp(x, 0, 1)
	return {ambulation, magnitude, stillness, north, west, south, east}
}

function handle_adjustments(
		choreo: Choreography,
		adjustment_anims: AdjustmentAnims,
	) {

	const {settings, ambulatory} = choreo
	let swivel = structuredClone(choreo.swivel)
	let adjustment = structuredClone(choreo.adjustment)

	const adjustment_is_needed = !scalar.within(
		swivel,
		settings.swivel.readjustment_margin,
		1 - settings.swivel.readjustment_margin,
	)

	if (!adjustment && adjustment_is_needed) {
		adjustment = {
			duration: settings.swivel.duration,
			progress: 0,
			initial_swivel: swivel,
			direction: swivel < settings.swivel.midpoint
				? "left"
				: "right",
		}
		adjustment_anims.start(adjustment)
	}

	if (adjustment) {
		const speed = 1 / adjustment.duration
		adjustment.progress += speed

		swivel = calculate_adjustment_swivel(settings, adjustment)

		if (adjustment.progress >= 1) {
			adjustment_anims.stop(adjustment)
			adjustment = null
		}
	}

	if (!adjustment && ambulatory.magnitude > settings.swivel.readjustment_margin) {
		const {midpoint} = settings.swivel
		const speed = calculate_swivel_speed(settings)
		const diff = midpoint - swivel

		if (Math.abs(diff) <= speed)
			swivel = midpoint
		else
			swivel += (diff < 0)
				? -speed
				: speed
	}

	return {swivel, adjustment}
}

function calculate_adjustment_swivel(settings: ChoreoSettings, adjustment: ChoreoSwivelAdjustment) {
	return scalar.map(adjustment.progress, [
		adjustment.initial_swivel,
		settings.swivel.midpoint,
	])
}

const circle = 2 * Math.PI

function calculate_character_rotation_in_radians(choreo: Choreography) {
	const [horizontal] = choreo.gimbal
	return circle * horizontal
}

function molasses2d(delta: number, from: Vec2, to: Vec2) {
	const [x, y] = vec2.subtract(to, from)
	return vec2.add(from, [
		cap_scalar_to_delta_positive_or_negative(x, delta),
		cap_scalar_to_delta_positive_or_negative(y, delta),
	])
}

function cap_scalar_to_delta_positive_or_negative(n: number, delta: number) {
	return scalar.within(n, -delta, delta)
		? n
		: n < 0
			? -delta
			: delta
}

