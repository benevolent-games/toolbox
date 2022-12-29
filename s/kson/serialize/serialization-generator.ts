
import {Stack} from "../utils/stack.js"
import {Report} from "./types/report.js"
import {controls} from "../text/controls.js"
import {processNode} from "./process-node.js"
import {Dictionary} from "../utils/dictionary.js"
import {Timekeep} from "../../utils/timekeep.js"
import {generateKeySpec} from "./generate-key-spec.js"
import {getControlBySymbol} from "../text/get-control-by-symbol.js"

export function *serializationGenerator(root: any) {
	let results: string = ""
	let cycles = 0

	const timekeep = new Timekeep("⚙️")

	const TIMER_INIT = timekeep.timers.init
	const dictionary = new Dictionary()
	const stack = new Stack<any>([root])
	const pushResult = (r: string) => results += r
	const report = (chunk?: string): Report => ({
		chunk,
		cycles,
		bytes: results.length,
	})
	TIMER_INIT()

	const TIMER_WHILE = timekeep.timers.while
	while (stack.size > 0) {
		const TIMER_REPORTING = timekeep.timers.reporting
		if (cycles++ % 10_000 === 0)
			yield report()
		TIMER_REPORTING()

		const TIMER_MAINLOOP = timekeep.timers.mainloop
		const node = stack.pop()

		if (typeof node === "symbol")
			pushResult(getControlBySymbol(node))

		else
			processNode(
				node,
				stack,
				dictionary,
				pushResult,
				timekeep.clocks,
			)

		TIMER_MAINLOOP()
	}
	TIMER_WHILE()

	const TIMER_FINISHING = timekeep.timers.finishing
	yield report(generateKeySpec(dictionary))
	yield report(controls.payloadsep)
	yield report(results)
	TIMER_FINISHING()

	timekeep.report()
}
