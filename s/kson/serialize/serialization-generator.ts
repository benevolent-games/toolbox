
import {Stack} from "../utils/stack.js"
import {Report} from "./types/report.js"
import {controls} from "../text/controls.js"
import {processNode} from "./process-node.js"
import {Dictionary} from "../utils/dictionary.js"
import {generateKeySpec} from "./generate-key-spec.js"
import {getControlBySymbol} from "../text/get-control-by-symbol.js"

export function *serializationGenerator(root: any) {
	let results: string = ""
	let cycles = 0

	const dictionary = new Dictionary()
	const stack = new Stack<any>([root])
	const pushResult = (r: string) => results += r
	const report = (chunk?: string): Report => ({
		chunk,
		cycles,
		bytes: results.length,
	})

	while (stack.size > 0) {
		if (cycles++ % 100_000 === 0)
			yield report()

		const node = stack.pop()

		if (typeof node === "symbol")
			pushResult(getControlBySymbol(node))

		else
			processNode(
				node,
				stack,
				dictionary,
				pushResult,
			)
	}

	yield report(generateKeySpec(dictionary))
	yield report(controls.payloadsep)
	yield report(results)
}
