
import {loop} from "./loopy.js"
import {human} from "./human.js"

export function ascii_progress_bar(progress: number, bars = 10) {
	let ascii = ""

	for (const i of loop(bars))
		ascii += (i <= Math.floor(progress * bars))
			? "="
			: "-"

	return `[${ascii}] ${human.percent(progress)}`
}

