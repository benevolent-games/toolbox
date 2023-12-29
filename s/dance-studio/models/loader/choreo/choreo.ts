
import {scalar} from "../../../../tools/math/scalar.js"
import {Vec2, vec2} from "../../../../tools/math/vec2.js"
import {CharacterInstance} from "../character/character_instance.js"
import {Choreography, Intent, LegAdjustment} from "../../../../humanoid/ecs/schema.js"
import {AdjustmentAnimations, AdjustmentDirection} from "../choreographer/parts/utils/adjustment_sequence.js"

const sensitivity = 1 / 100
const swivel_readjustment_margin = 1 / 10
const swivel_centerpoint = 0.5

export type Choreo = {
	gimbal: Vec2
	intent: Intent
	choreography: Choreography
}

export function prepare_choreography({
		character,
	}: {
		character: CharacterInstance
	}) {

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
		choreograph(original: Choreo) {
			const choreo = structuredClone(original)

			choreo.gimbal = gimbal_effected_by_glance(choreo)
			choreo.choreography.swivel = swivel_effected_by_glance(choreo)

			const ambulatory = calculate_ambulatory_report(choreo)
			choreo.choreography.ambulation = ambulatory.ambulation

			return {
				choreo,
				ambulatory,
			}
		},
	}
}

function adjustment_anim_for_direction(
		character: CharacterInstance,
		direction: AdjustmentDirection,
	) {
	return direction === "left"
		? character.anims.legs_stand_adjust_left
		: character.anims.legs_stand_adjust_right
}

function handle_adjustments(
		{choreography}: Choreo,
		adjustment_anims: AdjustmentAnims,
	) {

	let adjustment = structuredClone(choreography.adjustment)

	const adjustment_is_needed = !scalar.within(
		choreography.swivel,
		swivel_readjustment_margin,
		1 - swivel_readjustment_margin,
	)

	if (!choreography.adjustment && adjustment_is_needed) {
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

	}
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
		swivel_centerpoint,
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

