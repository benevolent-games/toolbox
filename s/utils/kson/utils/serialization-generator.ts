
import {Stack} from "./stack.js"
import {Dictionary} from "./dictionary.js"
import {controls} from "../text/controls.js"
import {processNode} from "./process-node.js"
import {generateKeySpec} from "./generate-key-spec.js"
import {getControlBySymbol} from "../text/get-control-by-symbol.js"
import {SerializationReport} from "../types/serialization-report.js"

export function *serializationGenerator(root: any) {
	let results: string = ""
	let cycles = 0

	const dictionary = new Dictionary()
	const stack = new Stack<any>([root])
	const pushResult = (r: string) => results += r

	const report = (chunk?: string): SerializationReport => ({
		chunk,
		cycles,
		bytes: results.length,
	})

	while (stack.size > 0) {
		if (cycles++ % 10_000 === 0)
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
