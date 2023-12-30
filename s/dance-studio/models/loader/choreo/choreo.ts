
import {scalar} from "../../../../tools/math/scalar.js"
import {Vec2, vec2} from "../../../../tools/math/vec2.js"
import {CharacterInstance} from "../character/character_instance.js"
import {Choreography, Intent, LegAdjustment} from "../../../../humanoid/ecs/schema.js"
import {AdjustmentDirection} from "../choreographer/parts/utils/adjustment_sequence.js"

/*

bad names:
- choreography
- choreo: Choreograpy
	- gimbal: Vec2
	- choreography
		- ambulation: Vec2
		- swivel: number
		- adjustment?: LegAdjustment
	- intent
		- amble
		- glance

good names:
- Choreographer2
- choreo
	- intent
		- amble
		- glance
	- gimbal
	- ambulation
	- swivel
	- adjustment?: LegAdjustment

*/

const sensitivity = 1 / 100

const swivel_settings = (() => {
	const readjustment_margin = 1 / 10
	const midpoint = 0.5
	const duration = 30 // counted in update ticks
	const speed = (midpoint - readjustment_margin) / duration
	return {readjustment_margin, midpoint, duration, speed}
})()

export type Choreo = {
	gimbal: Vec2
	intent: Intent
	choreography: Choreography
}

export type Ambulatory = ReturnType<typeof calculate_ambulatory_report>
export type ChoreographyMachine = ReturnType<typeof establish_choreography_machine>

export function establish_choreography_machine(character: CharacterInstance) {
	const {anims} = character

	const adjustment_animations: AdjustmentAnims = {
		start: ({direction}) => {
			const anim = adjustment_anim_for_direction(character, direction)
			anim.play(false)
			anim.pause()
		},
		stop: () => {
			character.anims.legs_stand_adjust_left.stop()
			character.anims.legs_stand_adjust_right.stop()
		},
		update: ({direction, progress}) => {
			const anim = adjustment_anim_for_direction(character, direction)
			const frame = scalar.map(progress, [
				anim.from,
				anim.to,
			])
			anim.weight = calculate_adjustment_weight(progress)
			anim.goToFrame(frame)
		},
	}

	return {
		character,
		update(original: Choreo) {
			const {choreo, ambulatory} = calculate_choreo_values(
				original,
				adjustment_animations,
			)
			synchornize_animations(choreo, ambulatory, anims)
			const rotation = character_rotation_in_radians(choreo)
			return {choreo, ambulatory, rotation}
		},
	}
}

/////////////////////////////////

export function calculate_choreo_values(
		original: Choreo,
		adjustment_anims: AdjustmentAnims,
	) {

	const choreo = structuredClone(original)

	choreo.gimbal = gimbal_effected_by_glance(choreo)
	choreo.choreography.swivel = swivel_effected_by_glance(choreo)

	const ambulatory = calculate_ambulatory_report(choreo)
	choreo.choreography.ambulation = ambulatory.ambulation

	const {swivel, adjustment} = handle_adjustments(
		choreo,
		ambulatory,
		adjustment_anims,
	)
	choreo.choreography.swivel = swivel
	choreo.choreography.adjustment = adjustment

	return {
		choreo,
		ambulatory,
	}
}

export function character_rotation_in_radians(choreo: Choreo) {
	const [horizontal] = choreo.gimbal
	return -2 * Math.PI * horizontal
}

export function synchornize_animations(
		choreo: Choreo,
		ambulatory: Ambulatory,
		anims: CharacterInstance["anims"],
	) {

	const [,vertical] = choreo.gimbal
	const {swivel, adjustment} = choreo.choreography

	anims.spine.weight = 1
	anims.spine.goToFrame(vertical * 1000)

	anims.swivel.weight = 1
	anims.swivel.goToFrame(swivel * 1000)

	const mod = function modulate_leg_weight(w: number) {
		return adjustment
			? scalar.cap(w - calculate_adjustment_weight(adjustment.progress))
			: w
	}

	anims.legs_stand_stationary.weight = mod(ambulatory.stillness)
	anims.legs_stand_forward.weight = mod(ambulatory.north)
	anims.legs_stand_backward.weight = mod(ambulatory.south)
	anims.legs_stand_leftward.weight = mod(ambulatory.west)
	anims.legs_stand_rightward.weight = mod(ambulatory.east)

	anims.arms_stand_unequipped_stationary.weight = ambulatory.stillness
	anims.arms_stand_unequipped_forward.weight = ambulatory.north
	anims.arms_stand_unequipped_backward.weight = ambulatory.south
	anims.arms_stand_unequipped_leftward.weight = ambulatory.west
	anims.arms_stand_unequipped_rightward.weight = ambulatory.east
}

////////////////////////////////

function adjustment_anim_for_direction(
		character: CharacterInstance,
		direction: AdjustmentDirection,
	) {
	return direction === "left"
		? character.anims.legs_stand_adjust_left
		: character.anims.legs_stand_adjust_right
}

function handle_adjustments(
		choreo: Choreo,
		ambulatory: Ambulatory,
		adjustment_anims: AdjustmentAnims,
	) {

	let swivel = structuredClone(choreo.choreography.swivel)
	let adjustment = structuredClone(choreo.choreography.adjustment)

	const adjustment_is_needed = !scalar.within(
		swivel,
		swivel_settings.readjustment_margin,
		1 - swivel_settings.readjustment_margin,
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

		swivel = calculate_adjustment_swivel(adjustment)

		if (adjustment.progress >= 1) {
			adjustment_anims.stop(adjustment)
			adjustment = undefined
		}
	}

	if (!adjustment && ambulatory.magnitude > 0.1) {
		const {midpoint, speed} = swivel_settings
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

export type AdjustmentAnims = {
	start: (adjustment: LegAdjustment) => void
	stop: (adjustment: LegAdjustment) => void
	update: (adjustment: LegAdjustment) => void
}

function calculate_adjustment_weight(progress: number) {
	return scalar.spline.quickLinear(progress, [0, 1, 1, 0])
}

function calculate_adjustment_swivel(adjustment: LegAdjustment) {
	return scalar.map(adjustment.progress, [
		adjustment.initial_swivel,
		swivel_settings.midpoint,
	])
}

function swivel_effected_by_glance(choreo: Choreo) {
	const [x] = choreo.intent.glance
	const {swivel} = choreo.choreography
	return scalar.cap(swivel + (x * sensitivity))
}

function gimbal_effected_by_glance(choreo: Choreo) {
	let [glanceX, glanceY] = choreo.intent.glance
	let [x, y] = choreo.gimbal
	x = scalar.wrap(x + (glanceX * sensitivity))
	y = scalar.cap(y + (glanceY * sensitivity))
	return [x, y] as Vec2
}

function calculate_ambulatory_report({choreography, intent}: Choreo) {
	const ambulation = molasses2d(1 / 10, choreography.ambulation, intent.amble)
	const [x, y] = intent.amble
	const magnitude = vec2.magnitude(ambulation)
	const stillness = scalar.cap(1 - magnitude)
	const north = scalar.cap(y, 0, 1)
	const west = -scalar.cap(x, -1, 0)
	const south = -scalar.cap(y, -1, 0)
	const east = scalar.cap(x, 0, 1)
	return {ambulation, magnitude, stillness, north, west, south, east}
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

