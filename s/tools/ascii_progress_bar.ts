
import {Pojo} from "@benev/slate"

import {loop} from "./loopy.js"
import {human} from "./human.js"
import {clamp} from "../math/scalar.js"

export const glyphs = {
	eline: ["=", "-"],
	oline: ["o", "—"],
	dots: ["●", "o"],
	blocks: ["■", "□"],
	patches: ["▓", "░"],
	slider: ["█", "—"],
} satisfies Pojo<[string, string]>

export function ascii_progress_bar(
		progress: number,
		{
			kind = "bar",
			bars = 10,
			show_percent = true,
			clamp_between_1_and_99_percent = true,
			glyphs: [a, b] = glyphs.slider,
		}: {
			kind?: "bar" | "knob"
			glyphs?: [string, string]
			bars?: number
			show_percent?: boolean
			clamp_between_1_and_99_percent?: boolean
		} = {}
	) {

	progress = clamp_between_1_and_99_percent
		? clamp(progress, 1/100, 99/100)
		: clamp(progress)

	let line = ""

	if (kind === "bar") {
		const position = Math.round(progress * bars)
		for (const i of loop(bars))
			line += (i < position)
				? a
				: b
	}
	else {
		const position = Math.round(progress * (bars - 1))
		for (const i of loop(bars))
			line += (i === position)
				? a
				: b
	}

	const percent = show_percent
		? ` ${human.percent(progress)}`
		: ""

	return line + percent
}

