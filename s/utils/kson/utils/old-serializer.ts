
import {Stack} from "./stack.js"
import {Dictionary} from "./dictionary.js"
import {controls} from "../text/controls.js"
import {processNode} from "./process-node.js"
import {generateKeySpec} from "./generate-key-spec.js"
import {getControlBySymbol} from "../text/get-control-by-symbol.js"

export function oldSerializer(root: any) {
	const results: string[] = []
	const dictionary = new Dictionary()
	const stack = new Stack<any>([root])
	const pushResult = (r: string) => results.push(r)

	while (stack.size > 0) {
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

	return generateKeySpec(dictionary)
		+ controls.payloadsep
		+ results.join("")
}
