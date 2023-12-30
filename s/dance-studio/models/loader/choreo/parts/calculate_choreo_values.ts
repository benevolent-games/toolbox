
import {calculate_swivel_speed} from "../settings.js"
import {scalar} from "../../../../../tools/math/scalar.js"
import {Vec2, vec2} from "../../../../../tools/math/vec2.js"
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
	return scalar.cap(swivel + (x * settings.sensitivity))
}

function gimbal_effected_by_glance(choreo: Choreography) {
	let [glanceX, glanceY] = choreo.intent.glance
	let [x, y] = choreo.gimbal
	x = scalar.wrap(x + (glanceX * choreo.settings.sensitivity))
	y = scalar.cap(y + (glanceY * choreo.settings.sensitivity))
	return [x, y] as Vec2
}

function calculate_ambulatory_report(choreo: Choreography): ChoreoAmbulatory {
	const ambulation = molasses2d(
		1 / 10,
		choreo.ambulatory.ambulation,
		choreo.intent.amble,
	)
	const [x, y] = choreo.intent.amble
	const magnitude = vec2.magnitude(ambulation)
	const stillness = scalar.cap(1 - magnitude)
	const north = scalar.cap(y, 0, 1)
	const west = -scalar.cap(x, -1, 0)
	const south = -scalar.cap(y, -1, 0)
	const east = scalar.cap(x, 0, 1)
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
			duration: 30,
			progress: 0,
			initial_swivel: swivel,
			direction: swivel < 0.5
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

function calculate_character_rotation_in_radians(choreo: Choreography) {
	const [horizontal] = choreo.gimbal
	return -2 * Math.PI * horizontal
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

